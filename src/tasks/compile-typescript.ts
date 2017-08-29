import * as fs from 'fs';
import * as path from 'path';

import { main as angularTypescriptCompiler } from '@angular/tsc-wrapped';
import { VinylFile as AngularVinylFile } from '@angular/tsc-wrapped/src/vinyl_file';
import * as VinylFile from 'vinyl';

import { cleanFolder } from './../utilities/clean-folder';

export function compileTypescript( name: string, target: 'ES5' | 'ES2015', sourcePath: string, destinationPath: string ): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		// Clear destination folder first
		await cleanFolder( destinationPath );

		// Create TypeScript configuration
		// TODO: Interface
		const typescriptConfig: any = JSON.parse( fs.readFileSync( 'src/config/typescript.config.json', 'utf-8' ) ); // TODO: async + JSON parse
		typescriptConfig.compilerOptions.target = target;
		typescriptConfig.compilerOptions.rootDir = sourcePath;
		typescriptConfig.compilerOptions.outDir = destinationPath;
		typescriptConfig.files = [
			path.join( sourcePath, 'index.ts' ), // TODO: From config
			path.join( sourcePath, 'typings.d.ts' ) // TODO: From config
		];
		typescriptConfig.angularCompilerOptions.flatModuleId = name;
		typescriptConfig.angularCompilerOptions.flatModuleOutFile = `${ name }.js`;

		// Create virtual 'tsconfig.json' file
		const typescriptConfigFile: AngularVinylFile = new VinylFile( {
			contents: new Buffer( JSON.stringify( typescriptConfig ) ),
			path: '.' // TODO: ...
		} );

		// Run Angular-specific TypeScript compiler
		await angularTypescriptCompiler( typescriptConfigFile, {
			basePath: '.' // TODO: ...
		} );

		resolve();

	} );
}
