import * as fs from 'fs';
import * as path from 'path';

import { Volume, createFsFromVolume } from 'memfs';

import { writeFile } from './write-file';

/**
 * Memory File System
 */
export class MemoryFileSystem {

	/**
	 * Virtual volume
	 */
	public volume: Volume;

	/**
	 * Virtual filesystem (module), connected to the virtual volume
	 */
	public fs: { [ key: string ]: any }; // Operations are exactly the same as the ones from the NodeJS fs module

	/**
	 * Constructor
	 *
	 * @param [initialPaths=[]] - List of initially existing paths (preventing 'x does not exist' errors later on)
	 */
	constructor( initialPaths: Array<string> = [] ) {
		this.volume = this.createVolume( initialPaths );
		this.fs = this.createFs( this.volume );
	}

	/**
	 * Create the virtual volume, create initial directory structure (if necesary)
	 *
	 * @param   initialPaths - List of initial paths
	 * @returns              - Virtual volume
	 */
	private createVolume( initialPaths: Array<string> ): Volume {
		const volume: Volume = Volume.fromJSON( {}, '/' );
		initialPaths.forEach( ( initialPath: string ) => {
			volume.mkdirpSync( initialPath );
		} );
		return volume;
	}

	/**
	 * Create the virtual filesystem for the given volume, plus setup the mappings (mocks)
	 *
	 * @param   volume - Virtual volume
	 * @returns        - Virtual filesystem (module)
	 */
	private createFs( volume: Volume ): { [ key: string ]: any } {

		// Create filesystem for volume
		const volumeFs: { [ key: string ]: any } = createFsFromVolume( volume );

		// Now, simply map all (original NodeJS) fs calls to in-memory (memfs) fs calls
		const fsMapping = Object
			.keys( fs )
			.reduce( ( all: any, method: any ): { [ key: string ]: any } => {
				all[ method ] = volumeFs[ method ];
				return all;
			}, {
				'@global': true // Monkey-patch deeply nested imports as well, affecting the whole dependency tree
			} );

		// Then, override parts of the mapping for special cases; for now this only includes the ability to access the real filesystem when
		// going into the 'node_modules' folder
		const modifiedFsMapping = Object
			.assign( fsMapping, {

				// Used by TypeScript when reading in definition files
				statSync: ( path: string ): fs.Stats => {
					return ( path.indexOf( 'node_modules' ) === -1 )
						? volumeFs.statSync( path )
						: fs.statSync( path );
				},

				// Used by TypeScript when reading in definition files
				readFileSync: ( path: any, options: any ): any => {
					return ( path.indexOf( 'node_modules' ) === -1 )
						? volumeFs.readFileSync( path, options )
						: fs.readFileSync( path, options );
				}

			} );

		return modifiedFsMapping;

	}

	/**
	 * Persist the given path (folder) to the real filesystem
	 *
	 * @param   pathToPersist - Path (folder) to be persisted
	 * @returns               - Promise, resolved when finished
	 */
	public persist( pathToPersist: string ): Promise<void> {
		return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

			const memVolState: { [ path: string ]: string } = this.volume.toJSON();
			const normalizedPathToPersist: string = `${ this.simplifyPath( pathToPersist ) }${ path.sep }`;

			// Filter out files & folders which are outside the path to be persisted
			const filesToPersist: Array<string> = Object
				.keys( memVolState )
				.filter( ( filePath: string ): boolean => {
					return this.simplifyPath( filePath ).startsWith( normalizedPathToPersist );
				} );

			// Write the files to disk (creating folders if necessary)
			await Promise.all(
				filesToPersist.map( async( filePath: string ): Promise<void> => {
					await writeFile( path.resolve( filePath ), memVolState[ filePath ] );
				} )
			);

			resolve();

		} );
	}

	/**
	 * Simpliy (kinda normalize) the given path by removing any information regarding partition / disk
	 *
	 * @param   originalPath - Original path
	 * @returns              - Normalized path
	 */
	private simplifyPath( originalPath: string ): string {
		return path.normalize( originalPath.replace( path.parse( originalPath ).root, '' ) );
	}

}
