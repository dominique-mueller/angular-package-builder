import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/single-library-custom-paths/packages/library/.angular-package.json',
] ).catch( ( error: Error ) => {
	// Do nothing
} );
