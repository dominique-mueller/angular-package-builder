import chalk from 'chalk';

// Different arrow symbol based on OS
const arrowSymbol = process.platform === 'win32' ? '→' : '➜';

/**
 * Logger
 */
export class Logger {

	/**
	 * Log debug message
	 *
	 * @param message - Message
	 */
	public debug( message: string ): void {
		if ( !!process.env.DEBUG ) {
			console.log( message );
		}
	}

	/**
	 * Task message
	 *
	 * @param message - Message
	 */
	public task( message: string ): void {
		if ( !!process.env.DEBUG ) {
			console.log( '' );
			console.log( '/////////////////////////////////////////////////////////////////////////////////////////' );
			console.log( `/// ${ message }` );
			console.log( '/////////////////////////////////////////////////////////////////////////////////////////' );
			console.log( '' );
		} else {
			console.log( chalk.white.bold( `  ${ arrowSymbol } ${ message }` ) );
		}
	}

	/**
	 * Success message
	 *
	 * @param message - Message
	 */
	public success( message: string ): void {
		if ( !!process.env.DEBUG ) {
			console.log( '/////////////////////////////////////////////////////////////////////////////////////////' );
			console.log( `/// ${ message }` );
			console.log( '/////////////////////////////////////////////////////////////////////////////////////////' );
		} else {
			console.log( chalk.green.bold( message ) );
		}
	}

	/**
	 * Warn message
	 *
	 * @param message - Message
	 */
	public warn( message: string ): void {
		if ( !!process.env.DEBUG ) {
			console.log( '/////////////////////////////////////////////////////////////////////////////////////////' );
			console.log( `/// WARNING: ${ message }` );
			console.log( '/////////////////////////////////////////////////////////////////////////////////////////' );
		} else {
			console.log( chalk.yellow.bold( `    WARNING: ${ message }` ) );
		}
	}

	/**
	 * Error message
	 *
	 * @param message - Message
	 */
	public error( message: string ): void {
		const [ messageTitle, ...messageBody ]: Array<string> = message.split( '\n' );
		if ( !!process.env.DEBUG ) {
			console.log( '/////////////////////////////////////////////////////////////////////////////////////////' );
			console.log( `/// ERROR: ${ messageTitle }` );
			console.log( `///        ${ messageBody.join( '\n       ' ) }` );
			console.log( '/////////////////////////////////////////////////////////////////////////////////////////' );
		} else {
			console.log( chalk.red.bold( `ERROR: ${ messageTitle }` ) );
			console.log( chalk.gray( `       ${ messageBody.join( '\n       ' ) }` ) );
		}
	}

	/**
	 * Title message
	 *
	 * @param message - Message
	 */
	public title( message: string ): void {
		if ( !!process.env.DEBUG ) {
			console.log( `${ message } [DEBUG MODE ENABLED]` );
		} else {
			console.log( chalk.white.bold.underline( message ) );
		}
	}

	/**
	 * Empty log line
	 */
	public empty(): void {
		console.log( '' );
	}

}

// Export as singleton
let loggerInstance: Logger;
export default ( () => {
	if ( !loggerInstance ) {
		loggerInstance = new Logger();
	}
	return loggerInstance;
} )();
