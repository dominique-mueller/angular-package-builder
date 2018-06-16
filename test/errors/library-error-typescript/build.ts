import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/errors/packages/library-error-typescript/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
