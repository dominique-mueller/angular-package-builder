import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/errors/library-style-unsupported/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
