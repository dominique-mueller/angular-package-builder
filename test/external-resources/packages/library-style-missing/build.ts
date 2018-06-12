import { runAngularPackageBuilder } from '../../../..';

runAngularPackageBuilder( [
	'test/external-resources/packages/library-style-missing/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
