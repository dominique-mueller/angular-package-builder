import { runAngularPackageBuilder } from '../../../..';

runAngularPackageBuilder( [
	'test/external-resources/packages/library-style-css-invalid/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
