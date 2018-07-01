const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

( async () => {

	console.log( 'BUILD FOR TEST: ERRORS & WARNINGS' );

	try {
		await runAngularPackageBuilder( [
			'test/errors/circular-dependencies-three/packages/library-tracking/.angular-package.json',
			'test/errors/circular-dependencies-three/packages/library-ui/.angular-package.json',
			'test/errors/circular-dependencies-three/packages/library-core/.angular-package.json'
		] );
	} catch ( error ) {
		// Dp nothing
	}

	try {
		await runAngularPackageBuilder( [
			'test/errors/circular-dependencies-two/packages/library-tracking/.angular-package.json',
			'test/errors/circular-dependencies-two/packages/library-ui/.angular-package.json',
			'test/errors/circular-dependencies-two/packages/library-core/.angular-package.json'
		] );
	} catch ( error ) {
		// Dp nothing
	}

	try {
		await runAngularPackageBuilder( [
			'test/errors/inner-circular-dependencies-two/packages/library-tracking/.angular-package.json',
			'test/errors/inner-circular-dependencies-two/packages/library-ui/.angular-package.json',
			'test/errors/inner-circular-dependencies-two/packages/library-core/.angular-package.json'
		] );
	} catch ( error ) {
		// Dp nothing
	}

	try {
		await runAngularPackageBuilder( [
			'test/errors/library-error-angular-compiler-2/.angular-package.json'
		] );
	} catch ( error ) {
		// Dp nothing
	}

	try {
		await runAngularPackageBuilder( [
			'test/errors/library-error-angular-compiler/.angular-package.json'
		] );
	} catch ( error ) {
		// Dp nothing
	}

	try {
		await runAngularPackageBuilder( [
			'test/errors/library-error-config-broken/.angular-package.json'
		] );
	} catch ( error ) {
		// Dp nothing
	}

	try {
		await runAngularPackageBuilder( [
			'test/errors/library-error-config-invalid/.angular-package.json'
		] );
	} catch ( error ) {
		// Dp nothing
	}

	try {
		await runAngularPackageBuilder( [
			'test/errors/library-error-config-missing/.angular-package.json'
		] );
	} catch ( error ) {
		// Dp nothing
	}

	try {
		await runAngularPackageBuilder( [
			'test/errors/library-error-rollup/.angular-package.json'
		] );
	} catch ( error ) {
		// Dp nothing
	}

	try {
		await runAngularPackageBuilder( [
			'test/errors/library-error-tsickle/.angular-package.json'
		] );
	} catch ( error ) {
		// Dp nothing
	}

	try {
		await runAngularPackageBuilder( [
			'test/errors/library-error-typescript/.angular-package.json'
		] );
	} catch ( error ) {
		// Dp nothing
	}

	try {
		await runAngularPackageBuilder( [
			'test/errors/library-style-css-invalid/.angular-package.json'
		] );
	} catch ( error ) {
		// Dp nothing
	}

	try {
		await runAngularPackageBuilder( [
			'test/errors/library-style-missing/.angular-package.json'
		] );
	} catch ( error ) {
		// Dp nothing
	}

	try {
		await runAngularPackageBuilder( [
			'test/errors/library-style-scss-invalid/.angular-package.json'
		] );
	} catch ( error ) {
		// Dp nothing
	}

	try {
		await runAngularPackageBuilder( [
			'test/errors/library-style-unsupported/.angular-package.json'
		] );
	} catch ( error ) {
		// Dp nothing
	}

	try {
		await runAngularPackageBuilder( [
			'test/errors/library-template-html-invalid/.angular-package.json'
		] );
	} catch ( error ) {
		// Dp nothing
	}

	try {
		await runAngularPackageBuilder( [
			'test/errors/library-template-missing/.angular-package.json'
		] );
	} catch ( error ) {
		// Dp nothing
	}

	try {
		await runAngularPackageBuilder( [
			'test/errors/library-template-unsupported/.angular-package.json'
		] );
	} catch ( error ) {
		// Dp nothing
	}

	try {
		await runAngularPackageBuilder( [
			'test/errors/library-warning-rollup/.angular-package.json'
		] );
	} catch ( error ) {
		// Dp nothing
	}

} )();
