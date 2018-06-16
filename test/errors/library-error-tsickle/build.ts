import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/errors/library-error-tsickle/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
