( async () => {

	console.log( 'BUILD FOR TEST: EXTERNAL RESOURCES' );
	await require( './packages/library-style-css/build.js' ).build();
	await require( './packages/library-style-css-empty/build.js' ).build();
	await require( './packages/library-style-scss/build.js' ).build();
	await require( './packages/library-style-scss-empty/build.js' ).build();
	await require( './packages/library-template-html/build.js' ).build();
	await require( './packages/library-template-html-empty/build.js' ).build();

} )();
