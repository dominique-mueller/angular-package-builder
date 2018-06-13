import { runAngularPackageBuilder } from '../../../..';

runAngularPackageBuilder( [
	'test/external-resources/packages/library-style-scss-invalid/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
