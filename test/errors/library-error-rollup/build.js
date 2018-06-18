const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

exports.build = () => runAngularPackageBuilder( [
	'test/errors/library-error-rollup/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
