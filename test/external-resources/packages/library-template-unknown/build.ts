import { runAngularPackageBuilder } from '../../../..';

runAngularPackageBuilder( [
	'test/external-resources/packages/library-template-unknown/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
