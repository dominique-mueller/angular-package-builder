const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

exports.build = () => runAngularPackageBuilder( [
	'test/errors/library-warning-rollup/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
