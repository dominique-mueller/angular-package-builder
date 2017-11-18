import * as fs from 'fs';
import { posix as path } from 'path';

import { Volume, createFsFromVolume } from 'memfs';

import { getFiles } from '../utilities/get-files';
import { normalizeLineEndings } from '../utilities/normalize-line-endings';
import { readFile } from './../utilities/read-file';
import { writeFile } from './../utilities/write-file';

/**
 * Memory File System
 *
 * - When filling up the memory file system, we also normalize line endings (to LF). This is necessary to ensure the compatibility with
 *   Windows at all time as sometimes tools are not optimized for it. For instance, tsickle seems to run into issues when CRLF is being
 *   used (see https://github.com/angular/tsickle/issues/596).
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
	 */
	constructor() {
		this.volume = this.createVolume();
		this.fs = this.createFs( this.volume );
	}

	/**
	 * Fill memory file system with contents from the given folder
	 *
	 * @param folderPath - Absolute path to folder
	 */
	public async fill( folderPath: string ): Promise<void> {

		// Find files, on the actual disk
		const fileGlobs: Array<string> = [
			path.join( folderPath, '**', '*.ts' ),
			`!${ path.join( folderPath, '**', '*.spec.ts' ) }`,
			path.join( folderPath, '**', '*.js' ),
			path.join( folderPath, '**', '*.json' ),
			path.join( folderPath, '**', '*.html' ),
			path.join( folderPath, '**', '*.sass' ),
			path.join( folderPath, '**', '*.scss' ),
			path.join( folderPath, '**', '*.less' ),
			path.join( folderPath, '**', '*.css' )
		];
		const filePaths: Array<string> = await getFiles( fileGlobs, '' );

		// Read files, from the actual disk
		const fileContents: Array<string> = await Promise.all(
			filePaths.map( ( file: string ): Promise<string> => {
				return readFile( file );
			} )
		);

		// Write files, to memory file system (synchronously, cause nothing is async in the virtual disk)
		filePaths.forEach( ( file: string, index: number ): void => {
			this.volume.mkdirpSync( path.dirname( file ) );
			this.volume.writeFileSync( file, normalizeLineEndings( fileContents[ index ] ), 'utf-8' );
		} );

	}

	/**
	 * Persist the given path (folder) to the real filesystem
	 *
	 * @param   pathToPersist - Path (folder) to be persisted
	 * @returns               - Promise, resolved when finished
	 */
	public async persist( pathToPersist: string ): Promise<void> {

		const memVolState: { [ path: string ]: string } = this.volume.toJSON();
		const normalizedPathToPersist: string = this.getVirtualPath( pathToPersist );

		// Filter out files & folders which are outside the path to be persisted
		const filesToPersist: Array<string> = Object
			.keys( memVolState )
			.filter( ( filePath: string ): boolean => {
				return filePath.startsWith( normalizedPathToPersist );
			} );

		// Write the files to disk (creating folders if necessary)
		await Promise.all(
			filesToPersist.map( async( filePath: string ): Promise<void> => {
				await writeFile( path.join( filePath ), memVolState[ filePath ] );
			} )
		);

	}

	/**
	 * Get virtual path to folder (no partition information, starts and ends with path separator)
	 *
	 * @param   originalPath - Original path
	 * @returns              - Normalized path
	 */
	private getVirtualPath( originalPath: string ): string {
		return originalPath[ 0 ] === path.sep
			? `${ originalPath }${ path.sep }`
			: `${ path.sep }${ originalPath.split( path.sep ).slice( 1 ).join( path.sep ) }${ path.sep }`;
	}

	/**
	 * Create the virtual volume
	 *
	 * @returns - Virtual volume
	 */
	private createVolume(): Volume {
		return Volume.fromJSON( {}, '/' );
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
		const fsFunctionMapping = Object
			.keys( fs )
			.reduce( ( fsFunctionMapping: { [ key: string ]: any }, functionName: any ): { [ key: string ]: any } => {
				fsFunctionMapping[ functionName ] = volumeFs[ functionName ];
				return fsFunctionMapping;
			}, {
				'@global': true // Monkey-patch deeply nested imports as well, affecting the whole dependency tree
			} );

		// Then, override parts of the mapping for special cases; for now this only includes the ability to access the real filesystem when
		// going into the 'node_modules' folder
		const fsFunctionMappingWithExceptions = { ...fsFunctionMapping, ...{
			statSync: ( path: string ): fs.Stats => {
				return ( path.indexOf( 'node_modules' ) === -1 )
					? volumeFs.statSync( path )
					: fs.statSync( path );
			},
			readFileSync: ( path: any, options: any ): any => {
				return ( path.indexOf( 'node_modules' ) === -1 )
					? volumeFs.readFileSync( path, options )
					: fs.readFileSync( path, options );
			},
			readdirSync: ( path: any, options: any ): any => {
				return ( path.indexOf( 'node_modules' ) === -1 )
					? volumeFs.readdirSync( path, options )
					: fs.readdirSync( path, options );
			}
		} };

		return fsFunctionMappingWithExceptions;

	}

}
