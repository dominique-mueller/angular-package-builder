( async () => {

	console.log( 'BUILD FOR TEST: MULTIPLE LIBRARIES' );
	await require( './packages/build' ).build();

} )();
