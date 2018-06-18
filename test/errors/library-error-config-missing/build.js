const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

exports.build = () => runAngularPackageBuilder( [
	'test/errors/library-error-config-missing/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
