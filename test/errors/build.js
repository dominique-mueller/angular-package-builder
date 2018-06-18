( async () => {

	console.log( 'BUILD FOR TEST: ERRORS & WARNINGS' );
	await require( './circular-dependencies-three/packages/build.js' ).build();
	await require( './circular-dependencies-two/packages/build.js' ).build();
	await require( './inner-circular-dependencies-two/packages/build.js' ).build();
	await require( './library-error-angular-compiler/build.js' ).build();
	await require( './library-error-angular-compiler-2/build.js' ).build();
	await require( './library-error-config-broken/build.js' ).build();
	await require( './library-error-config-invalid/build.js' ).build();
	await require( './library-error-config-missing/build.js' ).build();
	await require( './library-error-rollup/build.js' ).build();
	await require( './library-error-tsickle/build.js' ).build();
	await require( './library-error-typescript/build.js' ).build();
	await require( './library-style-css-invalid/build.js' ).build();
	await require( './library-style-missing/build.js' ).build();
	await require( './library-style-scss-invalid/build.js' ).build();
	await require( './library-style-unsupported/build.js' ).build();
	await require( './library-template-html-invalid/build.js' ).build();
	await require( './library-template-missing/build.js' ).build();
	await require( './library-template-unsupported/build.js' ).build();
	await require( './library-warning-rollup/build.js' ).build();

} )();
