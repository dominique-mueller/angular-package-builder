import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/errors/packages/library-template-html-invalid/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
