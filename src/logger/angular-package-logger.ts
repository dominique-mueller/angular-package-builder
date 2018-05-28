import chalk from 'chalk';
import * as log from 'log-update';

import { loggerSymbols } from './logger-symbols';
import { supportsAdvancedLogging } from '../utilities/supports-advanced-logging';
import { isWindows } from '../utilities/is-windows';
import { AngularPackageLoggerTask, AngularPackageLoggerMessage, AngularPackageLoggerMessageType, AngularPackageLoggerTaskStatus } from './angular-package-logger.interfaces';

/**
 * Angular Package Logger
 */
export class AngularPackageLogger {

    /**
     * Logging state (for advanced logging only)
     */
    private static state: Array<AngularPackageLoggerTask> = [];

    /**
     * Number of build steps (used for the build progress logging)
     */
    private static numberOfBuildSteps: number = 0;

    /**
     * Number of the currently executed build step (used for the build progress logging)
     */
    private static currentBuildStepNumber: number = 0;

    /**
     * Runtime of the current build, in ms (used for task success logging)
     */
    private static currentBuildRuntime: number;

    /**
     * Indentation on the left (used whne logging build details)
     */
    private static leftIndentation: string;

    /**
     * Maximum number of build number digits (used for padding the current task number to the same length)
     */
    private static buildNumberMaxNumberOfDigits: number;

    /**
     * Configure number of build steps (used for task progress logging)
     *
     * @param numberOfBuildSteps Number of build steps (aka Angular Packages to built)
     */
    public static configureNumberOfBuildSteps( numberOfBuildSteps: number ): void {
        this.numberOfBuildSteps = numberOfBuildSteps;
        this.buildNumberMaxNumberOfDigits = this.numberOfBuildSteps.toString().length;
        this.leftIndentation = this.numberOfBuildSteps === 1
            ? ''
            : ' '.repeat( this.buildNumberMaxNumberOfDigits * 2 + 4 );
    }

    /**
     * Log the tool title
     *
     * @param name Name
     */
    public static logTitle( name: string ): void {
        console.log( '' );
        console.log( isWindows() ? chalk.white( name ) : chalk.white.underline( name ) );
        console.log( '' );
    }

    /**
     * Log the build start
     *
     * @param packageName Package name
     */
    public static logBuildStart( packageName: string ): void {

        // Prepare
        this.currentBuildRuntime = new Date().getTime();
        this.currentBuildStepNumber++;

        // Calculate the padding necessary to extend the current build number to a common length
        const currentBuildStepNumberPaddingLeft: string = '0'
            .repeat( this.numberOfBuildSteps.toString().length - this.currentBuildStepNumber.toString().length );
        const buildProgressLog: string = this.numberOfBuildSteps === 1
            ? '' // Do not show if only one build
            : `[${ currentBuildStepNumberPaddingLeft }${ this.currentBuildStepNumber }/${ this.numberOfBuildSteps }] `; // Plus one space!

        // Log
        console.log( '' );
        console.log( `${ chalk.bold.blue( buildProgressLog ) }${ chalk.bold.white( `Package "${ packageName }"` ) }` );
        console.log( '' );

    }

    /**
     * Log the current build success
     */
    public static logBuildSuccess(): void {

        // Bake in dynamic logging
        if ( supportsAdvancedLogging() ) {
            log.done();
            this.state = [];
        }

        // Calculate build runtime
        this.currentBuildRuntime = new Date().getTime() -  this.currentBuildRuntime;

        // Log
        console.log( '' );
        console.log( chalk.bold.green( `${ this.leftIndentation }Success!` ), chalk.grey( `(${ ( this.currentBuildRuntime / 1000 ).toFixed( 2 ) } seconds)` ) );
        console.log( '' );

    }

    /**
     * Log the task start
     *
     * @param task Task name
     */
    public static logTaskStart( task: string ): void {

        // Log
        if ( supportsAdvancedLogging() ) {
            this.state.push( {
                task,
                status: 'running',
                messages: []
            } );
            this.logToConsoleAdvanced();
        } else {
            console.log( this.createTaskLogOutput( task, 'running' ) );
        }

    }

    /**
     * Log the current task success
     */
    public static logTaskSuccess(): void {

        // Log
        if ( supportsAdvancedLogging() ) {
            this.state.slice( -1 )[ 0 ].status = 'success';
            this.logToConsoleAdvanced();
        }

    }

    /**
     * Log message
     *
     * @param message Message
     */
    public static logMessage( message: string ): void {

        // Log (replaced default messages, but keeps other kinds of messages)
        if ( supportsAdvancedLogging() ) {
            this.state.slice( -1 )[ 0 ].messages = [
                ...this.state.slice( -1 )[ 0 ].messages.filter( ( loggerMessage: AngularPackageLoggerMessage ): boolean => {
                    return loggerMessage.type !== 'default';
                } ),
                {
                    type: 'default',
                    message: message
                }
            ];
            this.logToConsoleAdvanced();
        }

    }

    /**
     * Advanced / dynamic logging to console, based on the current state
     */
    private static logToConsoleAdvanced(): void {

        // Derive log lines from current state
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

        // Log
        log( logOutput.join( '\n' ) );

    }

    /**
     * Create the log output for a task
     *
     * @param task   Task name
     * @param status Task status
     */
    private static createTaskLogOutput( task: string, status: AngularPackageLoggerTaskStatus ): string {
        switch ( status ) {
            case 'success':
                return chalk.white( `${ this.leftIndentation }${ chalk.green( loggerSymbols.tick ) } ${ task }` );
            default:
                return chalk.white( `${ this.leftIndentation }${ loggerSymbols.pointer } ${ task }` );
        }
    }

    /**
     * Create the log output for a message
     *
     * @param message Message
     * @param type    Message type
     */
    private static createMessageLogOutput( message: string, type: AngularPackageLoggerMessageType ): string {
        switch ( type ) {
            case 'warning':
                return chalk.yellow( `${ this.leftIndentation }  ! ${ message }` );
            case 'error':
                return chalk.red( `${ this.leftIndentation }  X ${ message }` );
            default:
                return chalk.grey( `${ this.leftIndentation }  ${ loggerSymbols.arrow } ${ message }` );
        }
    }

}
