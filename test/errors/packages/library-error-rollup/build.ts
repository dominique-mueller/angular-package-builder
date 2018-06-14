import { runAngularPackageBuilder } from '../../../..';

runAngularPackageBuilder( [
	'test/errors/packages/library-error-rollup/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
