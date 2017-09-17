import * as typescript from 'typescript';

import { AngularResourceUrl } from './angular-resource-url.interface';

/**
 * Angular Resource Interface
 */
export interface AngularResource {
	oldKey: string;
	newKey: string;
	node: typescript.Node;
	urls: Array<AngularResourceUrl>;
}
