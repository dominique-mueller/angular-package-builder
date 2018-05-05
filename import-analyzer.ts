import * as path from 'path';

import * as typescript from 'typescript';

import Project, { ObjectLiteralExpression, SyntaxKind, ObjectLiteralElementLike, StringLiteral, Node, ImportDeclaration } from 'ts-simple-ast';

// Add source files - ONLY WORKING FOR THE ONES PASSED IN!

const project: Project = new Project();
project.addExistingSourceFile( path.resolve( './test/my-library/lib/src/input/input.component.ts' ) );

// Get imports - WORKING!

const importSources: Array<ImportDeclaration> = project.getSourceFiles()[ 0 ].getImportDeclarations();
console.log( importSources[ 0 ].getModuleSpecifier().getText() );

// Get decorator information - WORKING!

const templateUrlProperty: ObjectLiteralElementLike = ( <ObjectLiteralExpression> project.getSourceFiles()[ 0 ].getClasses()[ 0 ].getDecorator( 'Component' ).getArguments()[ 0 ] )
    .getProperty( 'templateUrl' );
const templateUrlValue: Node = templateUrlProperty.getChildrenOfKind( SyntaxKind.StringLiteral )[ 0 ];
const url: string = templateUrlValue
    .getText()
    .replace( /['"`]/g, '' );

templateUrlProperty.replaceWithText( `template: ''` );

// console.log( project.getSourceFiles()[ 0 ].getText() );



// const program: typescript.Program = typescript.createProgram( [ path.resolve( './test/my-library/lib/index.ts' ) ], {} );

// const sourceFiles: ReadonlyArray<typescript.SourceFile> = program.getSourceFiles();
// sourceFiles
//     .filter( ( sourceFile: typescript.SourceFile ): boolean => {
//         return sourceFile.fileName.indexOf( 'node_modules' ) === -1;
//     } )
//     .forEach( ( sourceFile: typescript.SourceFile ): void => {
//         // fileName for path, text for content
//         console.log( '' );
//         console.log( 'FILE:', sourceFile.fileName );
//         console.log( 'IMPORTS:', ( <any> sourceFile ).imports.map( ( sourceFileImport ) =>  sourceFileImport.text ) );

//         // if ( sourceFile.fileName.indexOf( 'input.component.ts' ) !== -1 ) {

//         //     typescriptSimple.get

//         // }

//     } );
