import { posix as path } from 'path';

/**
 * Unit Test
 */
describe( 'TEST ', () => {

	let originalProcessCwd: () => string;
	const projectPath: string = path.join( process.cwd().replace( /\\/g, '/' ), 'test', 'my-library' );

	jest.resetModules();

	// Hide logging output
	// jest.spyOn( console, 'log' ).mockImplementation( () => {
	// 	return;
	// } );

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
		const { main } = await import( './../index' );
		await main();

		expect( true ).toBe( true );

	} );

} );
