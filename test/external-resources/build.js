const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

( async () => {

	console.log( 'BUILD FOR TEST: EXTERNAL RESOURCES' );

	try {

		await runAngularPackageBuilder( [
			'test/external-resources/packages/library-style-css/.angular-package.json'
		] );

		await runAngularPackageBuilder( [
			'test/external-resources/packages/library-style-css-empty/.angular-package.json'
		] );

		await runAngularPackageBuilder( [
			'test/external-resources/packages/library-style-scss/.angular-package.json'
		] );

		await runAngularPackageBuilder( [
			'test/external-resources/packages/library-style-scss-empty/.angular-package.json'
		] );

		await runAngularPackageBuilder( [
			'test/external-resources/packages/library-template-html/.angular-package.json'
		] );

		await runAngularPackageBuilder( [
			'test/external-resources/packages/library-template-html-empty/.angular-package.json'
		] );

	} catch ( error ) {
		// Do nothing
	}

} )();
