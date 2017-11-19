import { posix as path } from 'path';

import { Bundle, Options, GenerateOptions } from 'rollup';
import * as parsePackageJsonName from 'parse-packagejson-name';
import * as unixify from 'unixify';

import { AngularPackageBuilderInternalConfig } from './../interfaces/angular-package-builder-internal-config.interface';
import { importWithFs } from './../utilities/import-with-fs';
import { getRollupInputConfig, getRollupOutputConfig } from '../config/rollup.config';

let rollup: any;
let writeFile: any;

/**
 * Generate JavaScript bundle
 */
export async function bundleJavascript( config: AngularPackageBuilderInternalConfig, target: 'ES2015' | 'ES5' | 'UMD' ): Promise<void> {

	rollup = ( await importWithFs( 'rollup' ) ).rollup;
	writeFile = ( await importWithFs( './../utilities/write-file' ) ).writeFile;

	// Get information upfront
	let sourcePath: string;
	let destinationPath: string;
	let rollupFormat: 'es' | 'umd';
	let bundleSuffix: string;
	switch( target ) {
		case 'ES2015':
			sourcePath = config.temporary.buildES2015;
			destinationPath = config.temporary.bundleFESM2015;
			rollupFormat = 'es';
			bundleSuffix = 'es2015';
			break;
		case 'ES5':
			sourcePath = config.temporary.buildES5;
			destinationPath = config.temporary.bundleFESM5;
			rollupFormat = 'es';
			bundleSuffix = 'es5';
			break;
		case 'UMD':
			sourcePath = config.temporary.buildES5;
			destinationPath = config.temporary.bundleUMD;
			rollupFormat = 'umd';
			bundleSuffix = 'umd';
			break;
	}

	// Get rollup configuration
	const rollupInputOptions: Options = await getRollupInputConfig( sourcePath, target, config );
	const rollupOutputOptions: GenerateOptions = getRollupOutputConfig( rollupFormat, config );

	// Generate the bundle
	const bundle: Bundle = await rollup( rollupInputOptions );
	const { code, map } = await bundle.generate( rollupOutputOptions );

	// Re-write sourcemap URLs
	const normalizedSourcePath: string = unixify( sourcePath );
	map.sources = map.sources.map( ( source: string ): string => {
		return path.relative( normalizedSourcePath, unixify( source ) );
	} );

	// Write bundle w/ sourcemaps to destination
	const fileName: string = `${ parsePackageJsonName( config.packageName ).fullName }.${ bundleSuffix }`;
	await Promise.all( [
		writeFile( path.join( destinationPath, `${ fileName }.js` ), code ),
		writeFile( path.join( destinationPath, `${ fileName }.js.map` ), map )
	] );

}
