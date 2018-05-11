import { StringLiteral, Identifier } from 'ts-simple-ast';

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

/**
 * Angular External Template Interface
 */
export interface AngularExternalTemplate {

    /**
     * Node which contains the template URL property key
     */
    node: Identifier;

    /**
     * Template resource
     */
    template: AngularExternalResource;

}

/**
 * Angular External Styles Interface
 */
export interface AngularExternalStyles {

    /**
     * Node which contains the styles URL property key
     */
    node: Identifier;

    /**
     * List of style resources
     */
    styles: Array<AngularExternalResource>;

}
