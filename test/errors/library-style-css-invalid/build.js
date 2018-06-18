const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

runAngularPackageBuilder( [
	'test/errors/library-style-css-invalid/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
