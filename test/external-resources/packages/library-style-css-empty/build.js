const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

exports.build = () => runAngularPackageBuilder( [
	'test/external-resources/packages/library-style-css-empty/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
