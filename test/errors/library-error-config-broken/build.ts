import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/errors/library-error-config-broken/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
