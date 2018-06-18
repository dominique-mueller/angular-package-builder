const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

exports.build = () => runAngularPackageBuilder( [
	'test/errors/library-error-typescript/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
