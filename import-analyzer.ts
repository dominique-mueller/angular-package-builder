import { Identifier } from 'ts-simple-ast';

import { AngularPackageTransformer } from './src/transformer/angular-package.transformer';
import { AngularExternalResource } from './src/transformer/angular-external-resource.interface';

// Add source files - ONLY WORKING FOR THE ONES PASSED IN!
const entryPath: string = './test/my-library/lib/index.ts';

const angularPackageTransformer: AngularPackageTransformer = new AngularPackageTransformer( entryPath );

const { nodes, resources }: any = angularPackageTransformer.getAllExternalTemplates();

nodes.forEach( ( node: Identifier ) => {
    angularPackageTransformer.rewriteExternalTemplateNode( node );
} );

resources.forEach( ( resource: AngularExternalResource ) => {
    angularPackageTransformer.rewriteExternalResourceNode( resource.node, 'MY AWESOME TEMPLATE' );
} );

console.log( angularPackageTransformer.typescriptProject.getSourceFiles()[ 3 ].getText() );

// console.log( nodes );
