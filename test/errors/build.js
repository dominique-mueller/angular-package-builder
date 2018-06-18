( async () => {

	console.log( 'BUILD FOR TEST: ERRORS & WARNINGS' );
	await require( './circular-dependencies-three/packages/build.js' );
	await require( './circular-dependencies-two/packages/build.js' );
	await require( './inner-circular-dependencies-two/packages/build.js' );
	await require( './library-error-angular-compiler/build.js' );
	await require( './library-error-angular-compiler-2/build.js' );
	await require( './library-error-config-broken/build.js' );
	await require( './library-error-config-invalid/build.js' );
	await require( './library-error-config-missing/build.js' );
	await require( './library-error-rollup/build.js' );
	await require( './library-error-tsickle/build.js' );
	await require( './library-error-typescript/build.js' );
	await require( './library-style-css-invalid/build.js' );
	await require( './library-style-missing/build.js' );
	await require( './library-style-scss-invalid/build.js' );
	await require( './library-style-unsupported/build.js' );
	await require( './library-template-html-invalid/build.js' );
	await require( './library-template-missing/build.js' );
	await require( './library-template-unsupported/build.js' );
	await require( './library-warning-rollup/build.js' );

} )();
