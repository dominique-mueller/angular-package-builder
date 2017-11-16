( async() => {

	// Run automatic release (the test cases will check the result)
	const { main } = await import( './index' );
	await main();

} )();
