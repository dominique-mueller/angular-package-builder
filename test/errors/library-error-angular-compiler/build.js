const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

runAngularPackageBuilder( [
	'test/errors/library-error-angular-compiler/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
