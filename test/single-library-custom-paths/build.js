const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

( async () => {

	try {

		await runAngularPackageBuilder( [
			'test/single-library-custom-paths/packages/library/.angular-package.json',
		] );

	} catch ( error ) {
		// Do nothing
	}

} )();
