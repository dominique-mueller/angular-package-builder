import { StringLiteral } from 'ts-simple-ast';

/**
 * Angular External Reosurce Interface
 */
export interface AngularExternalResource {

    /**
     * Absolute path the resource
     */
    path: string;

    /**
     * Node which contains the path
     */
    node: StringLiteral;

}
