import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/errors/library-error-rollup/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
