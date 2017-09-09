import * as fs from 'fs';
import * as path from 'path';

import * as proxyquire from 'proxyquire';
// import { main as tsc } from '@angular/tsc-wrapped';
import { VinylFile as AngularVinylFile } from '@angular/tsc-wrapped/src/vinyl_file';
import * as VinylFile from 'vinyl';

import { memFs, memVol } from './../utilities/memory-fs';
// import { getFiles } from './../utilities/get-files';
import { getTypescriptConfig } from './../config/typescript.config';
import { resolvePath } from './../utilities/resolve-path';
import { TypescriptConfig } from './../config/typescript.config.interface';

const debug: boolean = false;

/**
 * Compile TypeScript into JavaScript
 */
export function compileTypescript( sourcePath: string, sourceFile: string, destinationPath: string, name: string, target: 'ES5' | 'ES2015' ): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		const tsc = debug
			? ( await import( '@angular/tsc-wrapped' ) ).main
			: ( proxyquire( '@angular/tsc-wrapped', { fs: memFs } ) ).main;

		const getFiles = debug
			? ( await import( './../utilities/get-files' ) )
			: ( proxyquire( './../utilities/get-files', { fs: memFs } ) ).getFiles;

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

		process.on('unhandledRejection', r => console.log(r));

		// Run Angular-specific TypeScript compiler
		await tsc( typescriptConfigFile, {
			basePath: resolvePath( '.' ) // required!
		} );

		console.log( '2 ----' );
		console.log( Object.keys( memVol.toJSON() ) );
		console.log( '2 ----' );

		resolve();

	} );
}
