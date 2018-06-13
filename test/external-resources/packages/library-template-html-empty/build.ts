import { runAngularPackageBuilder } from '../../../..';

runAngularPackageBuilder( [
	'test/external-resources/packages/library-template-html-empty/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
