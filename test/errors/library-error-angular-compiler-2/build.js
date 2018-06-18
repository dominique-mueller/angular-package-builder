const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

exports.build = () => runAngularPackageBuilder( [
	'test/errors/library-error-angular-compiler-2/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
