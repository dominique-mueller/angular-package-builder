import { Identifier } from 'ts-simple-ast';

import { AngularExternalResource } from './angular-file-external-resources.interfaces';

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
