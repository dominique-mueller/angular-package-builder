import { runAngularPackageBuilder } from '../../../..';

runAngularPackageBuilder( [
	'test/errors/packages/library-template-missing/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
