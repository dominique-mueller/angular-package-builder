const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

( async () => {

	try {

		await runAngularPackageBuilder( [
			'test/multiple-libraries/packages/library-tracking/.angular-package.json',
			'test/multiple-libraries/packages/library-ui/.angular-package.json',
			'test/multiple-libraries/packages/library-core/.angular-package.json'
		] );

	} catch ( error ) {
		// Do nothing
	}


} )();
