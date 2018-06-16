import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/errors/library-template-html-invalid/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
