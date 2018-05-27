import chalk from 'chalk';
import * as log from 'log-update';

export const loggerSymbols: any = {
    arrow: process.platform === 'win32' ? '→' : '➜',
    tick: process.platform === 'win32' ? '√' : '✔',
    pointer: process.platform === 'win32' ? '>' : '❯'
};

/**
 * Angular Package Logger
 */
export class AngularPackageLogger {

    private static state: Array<AngularPackageLoggerTask> = [];

    private static numberOfAngularPackages: number = 0;

    private static packageCounter: number = 0;

    private static paddingLeft: string;

    private static currentBuildStartTime: number;

    public static configureNumberOfAngularPackages( numberOfAngularPackages: number ): void {
        this.numberOfAngularPackages = numberOfAngularPackages;
        this.paddingLeft = ' '.repeat( this.numberOfAngularPackages.toString().length * 2 + 4 );
    }

    /**
     * Log the tool name
     *
     * @param name Name
     */
    public static logTitle( name: string ): void {
        console.log( '' );
        console.log( process.platform === 'win32' ? chalk.white( name ) : chalk.white.underline( name ) );
        console.log( '' );
    }

    /**
     * Log the build start
     *
     * @param packageName Package name
     */
    public static logBuildStart( packageName: string ): void {
        this.currentBuildStartTime = new Date().getTime();
        this.packageCounter++;
        const counter: string = chalk.blue( `[${ this.packageCounter }/${ this.numberOfAngularPackages }]` );
        const title: string = chalk.white( `Package "${ packageName }"` );
        console.log( '' );
		console.log( `${ counter } ${ title }` );
		console.log( '' );
    }

    /**
     * Log the current build success
     */
    public static logBuildSuccess(): void {
        log.done();
        this.state = [];
        const currentBuildFinishTime: number = new Date().getTime();
        const processTime = ( ( currentBuildFinishTime - this.currentBuildStartTime ) / 1000 ).toFixed( 2 );
        this.currentBuildStartTime = 0;
        console.log( '' );
		console.log( chalk.bold.green( `${ this.paddingLeft }Success!` ), chalk.grey( `(${ processTime } seconds)` ) );
        console.log( '' );
    }

    public static logTaskStart( task: string ): void {
        this.state.push( {
            task,
            status: 'running',
            messages: []
        } );
        this.logToConsole();
    }

    public static logTaskSuccess(): void {
        this.state.slice( -1 )[ 0 ].status = 'success';
        this.logToConsole();
    }

    public static logMessage( message: string ): void {
        this.state.slice( -1 )[ 0 ].messages = [
            ...this.state.slice( -1 )[ 0 ].messages.filter( ( loggerMessage: AngularPackageLoggerMessage ): boolean => {
                return loggerMessage.type !== 'default';
            } ),
            {
                type: 'default',
                message: message
            }
        ];
        this.logToConsole();
    }

    private static logToConsole(): void {

        const logOutput: Array<string> = this.state
            .reduce( ( logLines: Array<string>, loggerTask: AngularPackageLoggerTask ): Array<string> => {

                // Task
                logLines.push( this.createTaskLogOutput( loggerTask.task, loggerTask.status ) );

                // Messages
                logLines.push( ...loggerTask.messages
                    .filter( ( loggerMessage: AngularPackageLoggerMessage ): boolean => {
                        return loggerTask.status === 'running' ? true : loggerMessage.type !== 'default';
                    } )
                    .map( ( loggerMessage: AngularPackageLoggerMessage ): string => {
                        return this.createMessageLogOutput( loggerMessage.message, loggerMessage.type );
                    } )
                );

                return logLines;
            }, [] );

        log( logOutput.join( '\n' ) );

    }

    private static createTaskLogOutput( task: string, status: string ): string {
        switch ( status ) {
            case 'success':
                return chalk.white.bold( `${ this.paddingLeft }${ chalk.green.bold( loggerSymbols.tick ) } ${ task }` );
            default:
                return chalk.white.bold( `${ this.paddingLeft }${ loggerSymbols.pointer } ${ task }` );
        }
    }

    private static createMessageLogOutput( message: string, type: AngularPackageLoggerType ): string {
        switch ( type ) {
            case 'warning':
                return chalk.yellow( `${ this.paddingLeft }  ! ${ message }` );
            case 'error':
                return chalk.red( `${ this.paddingLeft }  X ${ message }` );
            default:
                return chalk.grey( `${ this.paddingLeft }  ${ loggerSymbols.arrow } ${ message }` );
        }
    }

}

export interface AngularPackageLoggerTask {

    /**
     * Task name
     */
    task: string;

    /**
     * Task status
     */
    status: 'running' | 'success' | 'error';

    /**
     * Messages
     */
    messages: Array<AngularPackageLoggerMessage>;

}

export interface AngularPackageLoggerMessage {

    /**
     * Message
     */
    message: string;

    /**
     * Logging type
     */
    type: AngularPackageLoggerType;

}

export type AngularPackageLoggerType = 'default' | 'warning' | 'error';
