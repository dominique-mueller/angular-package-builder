import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/errors/packages/library-error-tsickle/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
