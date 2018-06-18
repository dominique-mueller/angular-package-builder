const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

exports.build = () => runAngularPackageBuilder( [
	'test/errors/library-style-unsupported/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
