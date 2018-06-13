import { runAngularPackageBuilder } from '../../../..';

runAngularPackageBuilder( [
	'test/external-resources/packages/library-template-html-invalid/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
