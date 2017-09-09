import * as fs from 'fs';
import * as path from 'path';

import { VinylFile as AngularVinylFile } from '@angular/tsc-wrapped/src/vinyl_file';
import * as VinylFile from 'vinyl';

import { AngularPackageBuilderConfig } from './../../index';
import { dynamicImport } from './../utilities/dynamic-import';
import { getTypescriptConfig } from './../config/typescript.config';
import { MemoryFileSystem } from './../memory-file-system';
import { resolvePath } from './../utilities/resolve-path';
import { TypescriptConfig } from './../config/typescript.config.interface';

/**
 * Compile TypeScript into JavaScript
 */
export function compileTypescript( config: AngularPackageBuilderConfig, memoryFileSystem: MemoryFileSystem | null, target: 'ES2015' | 'ES5' ): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		// Import
		const tsc = ( await dynamicImport( '@angular/tsc-wrapped', memoryFileSystem ) ).main;
		const getFiles = ( await dynamicImport( './../utilities/get-files', memoryFileSystem ) ).getFiles;

		// Get additional TypeScript definition files
		const filePatterns: Array<string> = [
			path.join( '**', '*.d.ts' )
		]
		const typescriptDefinitionsFiles: Array<string> = await getFiles( filePatterns, config.temporary.prepared, true );

		// Create TypeScript configuration
		const entryFiles: Array<string> = [
			path.join( config.temporary.prepared, config.entry.file ), // Only one entry file is allowed
			...typescriptDefinitionsFiles // Additional TypeScript definition files (not counting as entry file)
		];
		const typescriptConfig: TypescriptConfig = getTypescriptConfig(
			target,
			config.temporary.prepared,
			target === 'ES2015' ? config.temporary.buildES2015 : config.temporary.buildES5,
			config.packageName,
			entryFiles
		);

		// Create virtual 'tsconfig.json' file
		const typescriptConfigFile: AngularVinylFile = new VinylFile( {
			contents: new Buffer( JSON.stringify( typescriptConfig ) ),
			path: resolvePath( '.' ) // required!
		} );

		// Run Angular-specific TypeScript compiler
		await tsc( typescriptConfigFile, {
			basePath: resolvePath( '.' ) // required!
		} );

		resolve();

	} );
}
