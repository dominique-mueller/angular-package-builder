import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/errors/library-error-angular-compiler/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
