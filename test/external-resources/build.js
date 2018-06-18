( async () => {

	console.log( 'BUILD FOR TEST: EXTERNAL RESOURCES' );
	await require( './packages/library-style-css/build.js' );
	await require( './packages/library-style-css-empty/build.js' );
	await require( './packages/library-style-scss/build.js' );
	await require( './packages/library-style-scss-empty/build.js' );
	await require( './packages/library-template-html/build.js' );
	await require( './packages/library-template-html-empty/build.js' );

} )();
