import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/errors/library-error-typescript/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
