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
		console.log( chalk.white.bold( `  ${ arrowSymbol } ${ message }` ) );
	}

	/**
	 * Success message
	 *
	 * @param message - Message
	 */
	public success( message: string ): void {
		console.log( chalk.green.bold( message ) );
	}

	/**
	 * Error message
	 *
	 * @param message - Message
	 */
	public error( message: string ): void {
		const [ messageTitle, ...messageBody ]: Array<string> = message.split( '\n' );
		console.log( chalk.red.bold( `ERROR: ${ messageTitle }` ) );
		console.log( chalk.gray( `       ${ messageBody.join( '\n       ' ) }` ) );
	}

	/**
	 * Title message
	 *
	 * @param message - Message
	 */
	public title( message: string ): void {
		console.log( chalk.white.bold.underline( message ) );
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
