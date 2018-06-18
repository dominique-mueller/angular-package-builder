const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

runAngularPackageBuilder( [
	'test/external-resources/packages/library-template-html/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
