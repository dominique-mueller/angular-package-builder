// Increase default timeout
// We need this so that the Angular Package Builder can run through properly without running into timeout issues
jest.setTimeout( 60000 );

// Simulate non-TTY environment
// We need this to be able to properly mock away the console log statement
process.stdout.isTTY = false;

// Mock away the console logging statements (cleaner test output)
jest
	.spyOn( global.console, 'log' )
	.mockImplementation( () => jest.fn() );
