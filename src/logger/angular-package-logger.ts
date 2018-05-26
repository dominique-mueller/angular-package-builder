import chalk from 'chalk';
import * as log from 'log-update';

export const loggerSymbols: any = {
    arrow: process.platform === 'win32' ? '→' : '➜',
    tick: process.platform === 'win32' ? '√' : '✔',
    pointer: process.platform === 'win32' ? '>' : '❯'
};

export interface AngularPackageLoggerOptions {
    task?: string;
    message?: string;
    progress?: number;
}

/**
 * Angular Package Logger
 */
export class AngularPackageLogger {

    private static state: Array<AngularPackageLoggerTask> = [];

    public static log( options: AngularPackageLoggerOptions ): void {

        // Re-use or add new task
        if ( options.task && ( this.state.length === 0 || this.state[ this.state.length - 1 ].task !== options.task ) ) {
            this.state.push( {
                messages: [],
                task: options.task
            } );
        }
        const task: AngularPackageLoggerTask = this.state[ this.state.length - 1 ];

        // Set progress
        if ( !options.progress && !task.progress ) {
            task.progress = 0;
        } else if ( options.progress ) {
            task.progress = options.progress;
        }

        // Update message
        if ( options.message ) {
            task.messages = [
                ...task.messages.filter( ( loggerMessage: AngularPackageLoggerMessage ): boolean => {
                    return loggerMessage.type !== 'default';
                } ),
                {
                    type: 'default',
                    message: options.message
                }
            ];
        }

        this.doLog();

    }

    public static done(): void {
        log.done();
        this.state = [];
    }

    private static doLog(): void {

        const logOutput: Array<string> = this.state
            .reduce( ( logLines: Array<string>, loggerTask: AngularPackageLoggerTask ): Array<string> => {

                // Task
                logLines.push( this.createTaskLogOutput( loggerTask.task, loggerTask.progress ) );

                // Messages
                logLines.push( ...loggerTask.messages
                    .filter( ( loggerMessage: AngularPackageLoggerMessage ): boolean => {
                        return loggerTask.progress === 1 ? loggerMessage.type !== 'default' : true;
                    } )
                    .map( ( loggerMessage: AngularPackageLoggerMessage ): string => {
                        return this.createMessageLogOutput( loggerMessage.message, loggerMessage.type );
                    } )
                );

                return logLines;
            }, [] );

        log( logOutput.join( '\n' ) );

    }

    private static createTaskLogOutput( task: string, progress: number ): string {
        return progress === 1
            ? chalk.green.bold( `  ${ loggerSymbols.tick } ${ task }` )
            : progress === 0
                ? chalk.white.bold( `  ${ loggerSymbols.pointer } ${ task }` )
                : chalk.white.bold( `  ${ loggerSymbols.pointer } ${ task } (${ progress * 100 }%)` );
    }

    private static createMessageLogOutput( message: string, type: AngularPackageLoggerType ): string {
        switch ( type ) {
            case 'warning':
                return chalk.yellow( `    ! ${ message }` );
            case 'error':
                return chalk.red( `    X ${ message }` );
            default:
                return chalk.grey( `    ${ loggerSymbols.arrow } ${ message }` );
        }
    }

}

export interface AngularPackageLoggerTask {

    /**
     * Task name
     */
    task: string;

    /**
     * Progrss (between 0 and 1)
     */
    progress?: number;

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
