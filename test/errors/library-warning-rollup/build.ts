import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/warnings/library-warning-rollup/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
