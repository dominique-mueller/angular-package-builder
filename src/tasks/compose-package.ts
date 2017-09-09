import * as path from 'path';

import * as proxyquire from 'proxyquire';

import { AngularPackageBuilderConfig } from './../../index';
import { memFs, memVol, persistFolder } from '../utilities/memory-fs';
// import { copy } from './../utilities/copy';

const debug: boolean = false;

/**
 * Compile TypeScript into JavaScript
 */
export function composePackage( config: AngularPackageBuilderConfig ): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		const copy = debug
			? ( await import( './../utilities/copy' ) )
			: ( proxyquire( './../utilities/copy', { fs: memFs } ) ).copy;

		await Promise.all( [

			// Copy bundles
			await copy( path.join( config.output.temporary.bundleFESM2015, '**' ), config.output.folder ),
			await copy( path.join( config.output.temporary.bundleFESM5, '**' ), config.output.folder ),
			await copy( path.join( config.output.temporary.bundleUMD, '**' ), config.output.folder ),

			// Copy type definitions and AoT metadata
			await copy( path.join( config.output.temporary.buildES2015, '**', '*.d.ts' ), config.output.folder ),
			await copy( path.join( config.output.temporary.buildES2015, '**', '*.metadata.json' ), config.output.folder )

		] );

		console.log( '4 ----' );
		console.log( JSON.stringify( Object.keys( memVol.toJSON() ), null, '\n' ) );
		console.log( '4 ----' );

		if ( !debug ) {
			await persistFolder( config.output.folder );
		}

		resolve();

	} );
}
