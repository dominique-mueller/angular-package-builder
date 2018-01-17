import * as fs from 'fs';
import { posix as path } from 'path';

import { Volume, createFsFromVolume } from 'memfs';
import * as unixify from 'unixify';

import { getFiles } from '../utilities/get-files';
import { readFile } from '../utilities/read-file';
import { writeFile } from '../utilities/write-file';

/**
 * Memory File System
 *
 * - Absolute paths are automatically being converted into the unix format. For instance, Windows partition information get removed
 *   ('C:/' gets transformed into '/').
 * - When filling up the memory file system, we also normalize line endings (to LF). This is necessary to ensure the compatibility with
 *   Windows at all time as sometimes tools are not optimized for it. For instance, tsickle seems to run into issues when CRLF is being
 *   used (see https://github.com/angular/tsickle/issues/596).
 */
export class MemoryFileSystem {

	/**
	 * Virtual volume, containing our files
	 */
	public readonly volume: Volume;

	/**
	 * Virtual file system module, connected to the virtual volume
	 */
	public readonly fs: { [ key: string ]: any }; // Operations are exactly mapped to the ones from the NodeJS fs module

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
	 * @param folderPath - Absolute path to folder from which to load in the files
	 */
	public async fill( folderPath: string ): Promise<void> {

		// Find all 'interesting' files -- on the actual disk
		const fileGlobs: Array<string> = [
			path.join( folderPath, '**', '*.ts' ),
			`!${ path.join( folderPath, '**', '*.spec.ts' ) }`,
			path.join( folderPath, '**', '*.js' ),
			path.join( folderPath, '**', '*.json' ),
			path.join( folderPath, '**', '*.html' ),
			path.join( folderPath, '**', '*.sass' ),
			path.join( folderPath, '**', '*.scss' ),
			path.join( folderPath, '**', '*.css' )
		];
		const filePaths: Array<string> = await getFiles( fileGlobs );

		// Read files -- from the actual disk
		const fileContents: Array<string> = await Promise.all(
			filePaths.map( ( file: string ): Promise<string> => {
				return readFile( file );
			} )
		);

		// Write files -- to memory file system (synchronously, cause nothing is async in the virtual disk)
		filePaths.forEach( ( file: string, index: number ): void => {
			this.volume.mkdirpSync( path.dirname( file ) );
			this.volume.writeFileSync( file, fileContents[ index ], 'utf-8' );
		} );

	}

	/**
	 * Persist the given path (folder) to the real filesystem
	 *
	 * @param   folderPath - Path (folder) to be persisted
	 * @returns            - Promise, resolved when finished
	 */
	public async persist( folderPath: string ): Promise<void> {

		// Get full volume content
		const volumeContent: { [ path: string ]: string } = this.volume.toJSON();

		//  Get list of files to persist
		const normalizedFolderPath: string = `${ unixify( folderPath ) }${ path.sep }`;
		const files: Array<string> = Object
			.keys( volumeContent )
			.filter( ( filePath: string ): boolean => {
				return filePath.startsWith( normalizedFolderPath ); // The cheap kind of globbing ...
			} );

		// Write the files -- to actual disk
		await Promise.all(
			files.map( async( filePath: string ): Promise<void> => {
				await writeFile( path.join( filePath ), volumeContent[ filePath ] );
			} )
		);

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
			existsSync: ( path: string ): boolean => {
				return ( path.indexOf( 'node_modules' ) === -1 )
					? volumeFs.existsSync( path )
					: fs.existsSync( path );
			},
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
			},
			realpathSync: ( path: any, options: any ): any => {
				return ( path.indexOf( 'node_modules' ) === -1 )
					? volumeFs.realpathSync( path, options )
					: fs.realpathSync( path, options );
			}
		} };

		return fsFunctionMappingWithExceptions;

	}

}
