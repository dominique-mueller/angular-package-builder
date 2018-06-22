const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

( async () => {

	try {

		await runAngularPackageBuilder( [
			'test/blablabla/packages/library/.angular-package.json',
		] );

	} catch ( error ) {
		// Do nothing
	}


} )();
