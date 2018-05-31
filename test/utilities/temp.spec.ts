import { TypingsFile } from './typings-file';

import Project from 'ts-simple-ast';

const file: TypingsFile = new TypingsFile();
// file.fromSource( 'test/multiple-dependent-libraries/my-library-ui/dist/src/input/input.component.d.ts' );
file.fromSource( 'test/multiple-dependent-libraries/my-library-ui/dist/fesm2015/ui.js' );

// console.log( file.typingsFile );

const project: Project = new Project();
project.createSourceFile( 'temp', file.typingsFile );

console.log( project.getSourceFile( 'temp' ).getText() );
// console.log( project.getSourceFile( 'temp' ).getClasses()[ 0 ].getName() );
// console.log( project.getSourceFile( 'temp' ).getExportDeclarations()[ 0 ].getNamedExports().map( a => a.getText() ) );
