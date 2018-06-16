import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/errors/library-warning-rollup/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
