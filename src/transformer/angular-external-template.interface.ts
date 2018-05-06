import { Identifier } from 'ts-simple-ast';

import { AngularExternalResource } from './angular-external-resource.interface';

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
