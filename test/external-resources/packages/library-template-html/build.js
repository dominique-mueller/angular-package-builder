const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

exports.build = () => runAngularPackageBuilder( [
	'test/external-resources/packages/library-template-html/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
