import * as fs from 'fs';
import * as path from 'path';

import * as proxyquire from 'proxyquire';
import { fs as memfs, Volume, createFsFromVolume } from 'memfs';
// import { main as tsc } from '@angular/tsc-wrapped';
import { VinylFile as AngularVinylFile } from '@angular/tsc-wrapped/src/vinyl_file';
import * as VinylFile from 'vinyl';

import { cleanFolder } from './../utilities/clean-folder';
import { getFiles } from './../utilities/get-files';
import { getTypescriptConfig } from './../config/typescript.config';
import { resolvePath } from './../utilities/resolve-path';
import { TypescriptConfig } from './../config/typescript.config.interface';

/**
 * Compile TypeScript into JavaScript
 */
export function compileTypescript( sourcePath: string, sourceFile: string, destinationPath: string, name: string, target: 'ES5' | 'ES2015' ): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		// Clear destination folder first
		await cleanFolder( destinationPath );

		// Get additional TypeScript definition files
		const filePatterns: Array<string> = [
			path.join( '**', '*.d.ts' )
		]
		const typescriptDefinitionsFiles: Array<string> = await getFiles( filePatterns, sourcePath, true );

		// Create TypeScript configuration
		const entryFiles: Array<string> = [
			path.join( sourcePath, sourceFile ), // Only one entry file is allowed
			...typescriptDefinitionsFiles // Additional TypeScript definition files (not counting as entry file)
		];
		const typescriptConfig: TypescriptConfig = getTypescriptConfig( target, sourcePath, destinationPath, name, entryFiles );

		// Create virtual 'tsconfig.json' file
		const typescriptConfigFile: AngularVinylFile = new VinylFile( {
			contents: new Buffer( JSON.stringify( typescriptConfig ) ),
			path: resolvePath( '.' ) // required!
		} );

		const inVolume = Volume.fromJSON( {}, '/' );
		inVolume.mkdirpSync( process.cwd() );
		inVolume.mkdirpSync( path.join( process.cwd(), 'dist-angular-package-builder', 'library-build-es2015' ) );
		const inFs = createFsFromVolume( inVolume );
		const mockFs = Object.keys( fs ).reduce( ( all, method ) => {
			all[ method ] = inFs[ method ];
			return all;
		}, {
			'@global': true
		} );
		const tsc = proxyquire( '@angular/tsc-wrapped', {
			fs: mockFs
			// fs: {
			// 	writeFileSync: inFs.writeFileSync,
			// 	lstatSync: inFs.lstatSync,
			// 	existsSync: inFs.existsSync,
			// 	writeSync: inFs.writeSync,
			// 	openSync: inFs.openSync,
			// 	closeSync: inFs.closeSync,
			// 	'@global': true
			// }
		} ).main;

		// Run Angular-specific TypeScript compiler
		await tsc( typescriptConfigFile, {
			basePath: resolvePath( '.' ) // required!
		} );

		console.log( '----' );
		console.log( Object.keys( inVolume.toJSON() ) );
		console.log( '----' );

		resolve();

	} );
}
