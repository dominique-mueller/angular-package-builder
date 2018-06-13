import { runAngularPackageBuilder } from '../../../..';

runAngularPackageBuilder( [
	'test/errors/packages/library-error-angular-compiler-2/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
