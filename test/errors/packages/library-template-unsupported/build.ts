import { runAngularPackageBuilder } from '../../../..';

runAngularPackageBuilder( [
	'test/external-resources/packages/library-template-unsupported/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
