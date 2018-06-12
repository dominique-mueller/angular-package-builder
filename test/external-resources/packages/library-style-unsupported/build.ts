import { runAngularPackageBuilder } from '../../../..';

runAngularPackageBuilder( [
	'test/external-resources/packages/library-style-unsupported/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
