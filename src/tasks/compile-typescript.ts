import * as fs from 'fs';
import * as path from 'path';

import { main as angularTypescriptCompiler } from '@angular/tsc-wrapped';
import { VinylFile as AngularVinylFile } from '@angular/tsc-wrapped/src/vinyl_file';
import * as VinylFile from 'vinyl';

import { cleanFolder } from './../utilities/clean-folder';
import { getTypescriptConfig } from './../config/typescript.config';
import { resolvePath } from './../utilities/resolve-path';
import { TypescriptConfig } from './../config/typescript.config.interface';

export function compileTypescript( source: string, destination: string, name: string, target: 'ES5' | 'ES2015' ): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		// Clear destination folder first
		await cleanFolder( destination );

		// Create TypeScript configuration
		const entryFiles: Array<string> = [
			path.join( source, 'index.ts' ), // TODO: From config
			path.join( source, 'typings.d.ts' ) // TODO: From config
		];
		const typescriptConfig: TypescriptConfig = getTypescriptConfig( target, source, destination, name, `${ name }.js`, entryFiles );

		// Create virtual 'tsconfig.json' file
		const typescriptConfigFile: AngularVinylFile = new VinylFile( {
			contents: new Buffer( JSON.stringify( typescriptConfig ) ),
			path: resolvePath( '' ) // required!
		} );

		// Run Angular-specific TypeScript compiler
		await angularTypescriptCompiler( typescriptConfigFile, {
			basePath: resolvePath( '' ) // required!
		} );

		resolve();

	} );
}
