import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/errors/library-error-config-invalid/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
