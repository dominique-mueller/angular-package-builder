const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

runAngularPackageBuilder( [
	'test/errors/library-template-missing/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
