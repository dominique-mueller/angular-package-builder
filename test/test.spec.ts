import * as path from 'path';

/**
 * Unit Test
 */
describe( 'TEST ', () => {

	let originalProcessCwd: () => string;
	const projectPath: string = path.resolve( process.cwd(), 'test', 'my-library' );

	// Setup
	beforeAll( () => {
		originalProcessCwd = process.cwd
		process.cwd = () => projectPath;
	} );

	afterAll( () => {
		process.cwd = originalProcessCwd;
	} );

	it ( 'should do STRANGER THINGS', async() => {

		// Run automatic release (the test cases will check the result)
		const { main } = ( await import( './../index' ) );
		await main();

		expect( true ).toBe( true );

	} );

} );
