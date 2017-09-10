import { TypescriptConfig } from './typescript.config.interface';

import { resolvePath } from './../utilities/resolve-path';

/**
 * Get Typescript Config
 */
export function getTypescriptConfig( target: string, sourcePath: string, destinationPath: string, name: string, files: Array<string> ):
	TypescriptConfig {

	return {
		compilerOptions: {
			// diagnostics: true, // TODO: Test for debug mode
			// listFiles: true, // TODO: Test for debug mode
			// traceResolution: true, // TODO: Test for debug mode
			// listEmittedFiles: true, // TODO: Test for debug mode
			charset: 'utf8',
			declaration: true, // Emit TypeScript definition files (*.d.ts)
			emitDecoratorMetadata: true, // Keep information about decorators
			experimentalDecorators: true, // Enable decorators
			lib: [ // Use all of them (for maximum compatibility) -- except 'webworker'
				'es5',
				'es6',
				'es2015',
				'es7',
				'es2016',
				'es2017',
				'esnext',
				'dom',
				'dom.iterable',
				'scripthost',
				'es2015.core',
				'es2015.collection',
				'es2015.generator',
				'es2015.iterable',
				'es2015.promise',
				'es2015.proxy',
				'es2015.reflect',
				'es2015.symbol',
				'es2015.symbol.wellknown',
				'es2016.array.include',
				'es2017.object',
				'es2017.sharedmemory',
				'esnext.asynciterable'
			],
			module: 'ES2015', // Always generate ES6 modules
			moduleResolution: 'node',
			newLine: 'LF', // Necessary to make closure compiler annotations work correctly
			outDir: destinationPath,
			pretty: true, // Pretty error messages
			rootDir: sourcePath,
			sourceMap: true,
			sourceRoot: sourcePath,
			target,
			typeRoots: [
				resolvePath( 'node_modules/@types' )
			]
		},
		files,
		angularCompilerOptions: {
			annotateForClosureCompiler: true, // Note: Only works with 'LF' line endings
			flatModuleId: name,
			flatModuleOutFile: `${ name }.js`,
			skipTemplateCodegen: true,
			strictMetadataEmit: true
		}
	};

}
