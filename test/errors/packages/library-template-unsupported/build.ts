import { runAngularPackageBuilder } from '../../../..';

runAngularPackageBuilder( [
	'test/errors/packages/library-template-unsupported/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
