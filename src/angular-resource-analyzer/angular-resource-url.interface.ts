import * as typescript from 'typescript';

/**
 * Angular resource URL interface
 */
export interface AngularResourceUrl {
	url: string;
	node: typescript.Node;
	content?: string; // Not part of the initial analysis result, add later on
}
