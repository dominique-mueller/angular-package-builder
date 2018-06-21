import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/blablabla/packages/library/.angular-package.json',
] ).catch( ( error: Error ) => {
	// Do nothing
} );
