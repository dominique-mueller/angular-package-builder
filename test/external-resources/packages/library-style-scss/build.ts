import { runAngularPackageBuilder } from '../../../..';

runAngularPackageBuilder( [
	'test/external-resources/packages/library-style-scss/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
