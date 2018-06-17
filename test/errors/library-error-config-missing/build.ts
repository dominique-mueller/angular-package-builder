import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/errors/library-error-config-missing/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
