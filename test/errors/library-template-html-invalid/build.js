const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

runAngularPackageBuilder( [
	'test/errors/library-template-html-invalid/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
