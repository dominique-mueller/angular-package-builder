import { runAngularPackageBuilder } from '../../../..';

runAngularPackageBuilder( [
	'test/external-resources/packages/library-template-missing/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
