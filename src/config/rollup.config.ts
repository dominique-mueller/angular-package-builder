import * as path from 'path';

import { Options, Bundle, Warning, Plugin, WriteOptions } from 'rollup';
// import * as commonjs from 'rollup-plugin-commonjs';
import * as nodeResolve from 'rollup-plugin-node-resolve';

import { angularDependencies } from './../static/angular.dependencies';
import { getSafeDependencyName } from './../utilities/get-safe-dependency-name';
import { RollupInputConfig, RollupOutputConfig } from './rollup.config.interface';
import { rxjsDependencies } from './../static/rxjs.dependencies';
import { dynamicImport } from '../utilities/dynamic-import';
import { MemoryFileSystem } from '../memory-file-system/memory-file-system';

/**
 * Get Rollup Input Config
 */
export async function getRollupInputConfig( sourcePath: string, name: string, dependencies: { [ dependency: string ]: string }, memoryFileSystem: MemoryFileSystem ): Promise<RollupInputConfig> {

	const commonjs = ( await dynamicImport( 'rollup-plugin-commonjs', memoryFileSystem ) );

	return {
		external: Object.keys( dependencies ),
		input: path.join( sourcePath, `${ name }.js` ), // Previously 'entry' which is now deprecated
		onwarn: ( warning ) => {
			console.warn( warning.message );
		},
		plugins: [
			nodeResolve(),
			commonjs()
		]
	};

}

/**
 * Get Rollup Output Config
 */
export function getRollupOutputConfig( name: string, format: 'es' | 'umd', dependencies: { [ dependency: string ]: string } ): RollupOutputConfig {

	return {
		exports: 'named', // We export multiple things
		format,
		globals: dependencies,
		name, // Required for UMD bundles
		sourcemap: true
	};

}

/**
 * Get rollup dependency map
 */
export function getRollupDependencies( dependencies: Array<string> ): { [ dependency: string ]: string } {

	const otherDependencies: { [ dependency: string ]: string } = dependencies

		// Filter out Angular and RxJS dependencies
		.filter( ( dependency: string ) => {
			return !dependency.startsWith( '@angular/' ) && dependency !== 'rxjs';
		} )

		// Create the package -> name map
		.reduce( ( dependencies: { [ dependency: string ]: string }, dependency: string): { [ dependencies: string ]: string } => {
			dependencies[ dependency ] = getSafeDependencyName( dependency );
			return dependencies;
		}, {} );

	return Object.assign( angularDependencies, rxjsDependencies, otherDependencies ); // Let dependencies overwrite pre-defined ones

}
