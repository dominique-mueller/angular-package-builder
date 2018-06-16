import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/errors/library-template-missing/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
