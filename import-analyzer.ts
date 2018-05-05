import { posix as path } from 'path';

import * as typescript from 'typescript';

import Project, { ObjectLiteralExpression, SyntaxKind, ObjectLiteralElementLike, ImportDeclaration, ClassDeclaration, SourceFile } from 'ts-simple-ast';



export class AngularLibraryAnalyzer {

    public readonly files: Map<string, any>;

    private readonly typescriptProject: Project;

    constructor( entryFilePath: string ) {

        // Create TypeScript program, using the original TypeScript API to get the module resolution feature
        const absoluteEntryFilePath: string = path.resolve( entryFilePath );
        const typescriptProgram: typescript.Program = typescript.createProgram( [ absoluteEntryFilePath ], {} );

        // Get all source file paths, excluding all external libraries & typing files
        const absoluteSourceFilePaths: Array<string> = typescriptProgram.getSourceFiles()
            .filter( ( sourceFile: typescript.SourceFile ): boolean => {
                return !typescriptProgram.isSourceFileFromExternalLibrary( sourceFile );
            } )
            .filter( ( sourceFile: typescript.SourceFile ): boolean => {
                return !sourceFile.isDeclarationFile;
            } )
            .map( ( sourceFile: typescript.SourceFile ): string => {
                return sourceFile.fileName;
            } );

        // Create TypeScript project, and load in the source files discovered above
        this.typescriptProject = new Project();
        this.typescriptProject.addExistingSourceFiles( absoluteSourceFilePaths );

        // Save files
        const files: Array<Array<any>> = absoluteSourceFilePaths.map( ( absoluteSourceFilePath: string ) => {
            return [
                absoluteSourceFilePath,
                {
                    imports: [],
                    templates: [],
                    styles: []
                }
            ];
        } );
        this.files = new Map<string, any>( <Iterable<any>> files );

        console.log( this.files );

    }

    private getExternalFileImports( sourceFile: SourceFile ): Array<string> {
        return sourceFile
            .getImportDeclarations()
            .filter( ( importDeclaration: ImportDeclaration ): boolean => {
                return !importDeclaration.isModuleSpecifierRelative();
            } )
            .map( ( importDeclaration: ImportDeclaration ): string => {
                return importDeclaration
                    .getModuleSpecifier()
                    .getText()
                    .replace( /['"`]/g, '' );
            } );
    }

}


// Add source files - ONLY WORKING FOR THE ONES PASSED IN!
const entryPath: string = './test/my-library/lib/index.ts';

const angularLibraryAnalyzer: AngularLibraryAnalyzer = new AngularLibraryAnalyzer( entryPath );

/*

// Prepare results
let sourceFilesWithInformation: Array<any> = sourceFilePaths
    .map( ( sourceFilePath: string ) => {
        return {
            path: sourceFilePath,
            externalImports: [],
            externalTemplates: [],
            externalStyles: [],
        };
    } );

// Get external imports
sourceFilesWithInformation.map( ( sourceFile: any ) => {

    sourceFile.externalImports = typescriptProject
        .getSourceFile( sourceFile.path )
        .getImportDeclarations()
        .filter( ( importDeclaration: ImportDeclaration ): boolean => {
            return !importDeclaration.isModuleSpecifierRelative();
        } )
        .map( ( importDeclaration: ImportDeclaration ): string => {
            return importDeclaration
                .getModuleSpecifier()
                .getText()
                .replace( /['"`]/g, '' );
        } );

    return sourceFile;

} );

// Get external imports
// TODO: Get style URLs
sourceFilesWithInformation.forEach( ( sourceFile: any ) => {

    sourceFile.externalTemplates = typescriptProject
        .getSourceFile( sourceFile.path )
        .getClasses()
        .reduce( ( externalTemplates: Array<any>, classDeclaration: ClassDeclaration ): any => {
            try {
                const componentDecorator: ObjectLiteralExpression = <ObjectLiteralExpression> classDeclaration
                    .getDecoratorOrThrow( 'Component' )
                    .getArguments()[ 0 ];
                const templateUrlDefinition: ObjectLiteralElementLike = componentDecorator
                    .getPropertyOrThrow( 'templateUrl' );
                const templateUrlPath: string = templateUrlDefinition
                    .getChildrenOfKind( SyntaxKind.StringLiteral )[ 0 ]
                    .getText()
                    .replace( /['"`]/g, '' );
                const templateUrlAbsolutePath: string = path.isAbsolute( templateUrlPath )
                    ? templateUrlPath
                    : path.join( path.dirname( sourceFile.path ), templateUrlPath );
                externalTemplates.push( {
                    path: templateUrlAbsolutePath,
                    definition: templateUrlDefinition,
                } );
            } catch ( error ) {
                // Do nothing
            } finally {
                return externalTemplates;
            }
        }, [] );

        sourceFile.externalStyles = typescriptProject
            .getSourceFile( sourceFile.path )
            .getClasses()
            .reduce( ( externalStyles: Array<any>, classDeclaration: ClassDeclaration ): any => {
                try {
                    const componentDecorator: ObjectLiteralExpression = <ObjectLiteralExpression> classDeclaration
                        .getDecoratorOrThrow( 'Component' )
                        .getArguments()[ 0 ];
                    const styleUrlsDefinition: ObjectLiteralElementLike = componentDecorator
                        .getPropertyOrThrow( 'styleUrls' );
                    console.log( styleUrlsDefinition.getChildrenOfKind( SyntaxKind.ArrayLiteralExpression )[ 0 ] );
                    // const templateUrlPath: string = templateUrlDefinition
                    //     .getChildrenOfKind( SyntaxKind.StringLiteral )[ 0 ]
                    //     .getText()
                    //     .replace( /['"`]/g, '' );
                    // const templateUrlAbsolutePath: string = path.isAbsolute( templateUrlPath )
                    //     ? templateUrlPath
                    //     : path.join( path.dirname( sourceFile.path ), templateUrlPath );
                    // externalTemplates.push( {
                    //     path: templateUrlAbsolutePath,
                    //     definition: templateUrlDefinition,
                    // } );
                } catch ( error ) {
                    // Do nothing
                } finally {
                    return externalStyles;
                }
            }, [] );

} );

console.dir( sourceFilesWithInformation[ 1 ] );

*/

// templateUrlProperty.replaceWithText( `template: ''` );
