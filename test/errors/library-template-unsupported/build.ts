import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/errors/library-template-unsupported/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
