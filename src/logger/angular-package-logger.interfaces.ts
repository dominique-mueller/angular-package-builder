/**
 * Angular Package Logger Task interface
 */
export interface AngularPackageLoggerTask {

    /**
     * Task name
     */
    task: string;

    /**
     * Task status
     */
    status: AngularPackageLoggerTaskStatus;

    /**
     * Messages
     */
    messages: Array<AngularPackageLoggerMessage>;

}

/**
 * Angular Package Logger Message interface
 */
export interface AngularPackageLoggerMessage {

    /**
     * Message
     */
    message: string;

    /**
     * Logging type
     */
    type: AngularPackageLoggerMessageType;

}

/**
 * Angular Package Logger Task Status Type
 */
export type AngularPackageLoggerTaskStatus = 'running' | 'success' | 'error';

/**
 * Angular Package Logger Message Type Type
 */
export type AngularPackageLoggerMessageType = 'default' | 'warning' | 'error';
