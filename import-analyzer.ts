import * as typescript from 'typescript';

const fileContent: string = `
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LIBInputComponent } from './input/input.component';
import { LIBDataService } from './data/data.service';

/**
 * Notifier module
 */
@NgModule( {
	declarations: [
		LIBInputComponent
	],
	exports: [
		LIBInputComponent
	],
	imports: [
		CommonModule
	],
	providers: [
		LIBDataService
	]
} )
export class LIBModule {}
`;

const sourceFile: typescript.SourceFile = typescript.createSourceFile( 'aaa', fileContent, typescript.ScriptTarget.Latest, true );

const fileImportSources = [];
findImport( sourceFile );

console.log( fileImportSources );

function findImport( node: typescript.Node ): void {

    if ( typescript.isImportDeclaration( node ) ) {
        const importSource: string = node
            .getChildren()
            .find( typescript.isStringLiteral ) // Gets import source
            .getText()
            .replace( /['"`]/g, '' ); // Removes any quotemarks otherwhise included in the token
        fileImportSources.push( importSource );
    }

    typescript.forEachChild( node, findImport.bind( this ) );

}
