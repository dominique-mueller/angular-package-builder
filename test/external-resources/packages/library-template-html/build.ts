import { runAngularPackageBuilder } from '../../../..';

runAngularPackageBuilder( [
	'test/external-resources/packages/library-template-html/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
