import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/single-library/packages/library/.angular-package.json',
] ).catch( ( error: Error ) => {
	// Do nothing
} );
