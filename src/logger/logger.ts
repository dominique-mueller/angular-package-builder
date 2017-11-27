import chalk from 'chalk';

/**
 * Logger
 */
export class Logger {

	/**
	 * Arrow symbol
	 */
	private static readonly arrowSymbol: string = process.platform === 'win32' ? '→' : '➜';

	/**
	 * Task message
	 *
	 * @param message - Message
	 */
	public static task( message: string ): void {
		console.log( chalk.bold( `  ${ this.arrowSymbol } ${ message }` ) );
	}

	/**
	 * Success message
	 *
	 * @param message - Message
	 */
	public static success( message: string ): void {
		console.log( chalk.green.bold( message ) );
	}

	/**
	 * Warn message
	 *
	 * @param message - Message
	 */
	public static warn( message: string ): void {
		const [ messageTitle, ...messageBody ]: Array<string> = message.split( '\n' );
		console.log( chalk.yellow.bold( `    WARNING: ${ messageTitle }` ) );
		console.log( chalk.gray( `             ${ messageBody.join( '\n             ' ) }` ) );
	}

	/**
	 * Error message
	 *
	 * @param message - Message
	 */
	public static error( message: string ): void {
		const [ messageTitle, ...messageBody ]: Array<string> = message.split( '\n' );
		console.log( chalk.red.bold( `ERROR: ${ messageTitle }` ) );
		console.log( chalk.gray( `       ${ messageBody.join( '\n       ' ) }` ) );
	}

	/**
	 * Title message
	 *
	 * @param message - Message
	 */
	public static title( message: string ): void {
		console.log( chalk.white.bold.underline( message ) );
	}

	/**
	 * Empty log line
	 */
	public static empty(): void {
		console.log( '' );
	}

}
