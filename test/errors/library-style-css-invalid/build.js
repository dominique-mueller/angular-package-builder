const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

exports.build = () => runAngularPackageBuilder( [
	'test/errors/library-style-css-invalid/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
