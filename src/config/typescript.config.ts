import * as deepmerge from 'deepmerge';

import { AngularPackageBuilderInternalConfig } from '../interfaces/angular-package-builder-internal-config.interface';
import { resolvePath } from './../utilities/resolve-path';
import { TypescriptConfig } from './typescript.config.interface';

/**
 * Get Typescript Config
 */
export function getTypescriptConfig(
	target: string,
	destinationPath: string,
	files: Array<string>,
	config: AngularPackageBuilderInternalConfig
): TypescriptConfig {

	return {
		compilerOptions: deepmerge(
			{
				// diagnostics: true, // TODO: Test for debug mode
				// listFiles: true, // TODO: Test for debug mode
				// traceResolution: true, // TODO: Test for debug mode
				// listEmittedFiles: true, // TODO: Test for debug mode
				declaration: true, // Emit TypeScript definition files (*.d.ts)
				emitDecoratorMetadata: true, // Keep information about decorators
				experimentalDecorators: true, // Enable decorators
				lib: [ // Use all of them (for maximum compatibility)
					'es5',
					'es6',
					'es2015',
					'es7',
					'es2016',
					'es2017',
					'esnext',
					'dom',
					'dom.iterable',
					'scripthost'
				],
				module: 'ES2015', // Always generate ES6 modules
				moduleResolution: 'node',
				newLine: 'LF', // Necessary to make closure compiler annotations work correctly
				outDir: destinationPath,
				pretty: true, // Pretty error messages
				rootDir: config.temporary.prepared,
				sourceMap: true,
				sourceRoot: config.temporary.prepared,
				target,
				typeRoots: [
					resolvePath( 'node_modules/@types' )
				]
			},
			config.compilerOptions
		),
		files,
		angularCompilerOptions: deepmerge(
			{
				annotateForClosureCompiler: true, // Note: Only works with 'LF' line endings
				flatModuleId: config.packageName,
				flatModuleOutFile: `${ config.packageName }.js`,
				preserveWhitespaces: false,
				skipTemplateCodegen: true,
				strictMetadataEmit: true
			},
			config.angularCompilerOptions
		)
	};

}
