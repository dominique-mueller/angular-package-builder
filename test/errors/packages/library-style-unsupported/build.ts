import { runAngularPackageBuilder } from '../../../..';

runAngularPackageBuilder( [
	'test/errors/packages/library-style-unsupported/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
