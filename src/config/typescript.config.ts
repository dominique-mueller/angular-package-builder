import { TypescriptConfig } from './typescript.config.interface';

/**
 * Get Typescript Config
 */
export function getTypescriptConfig( target: string, sourcePath: string, destinationPath: string, name: string, files: Array<string> ):
	TypescriptConfig {

	return {
		compilerOptions: {
			declaration: true,
			emitDecoratorMetadata: true,
			experimentalDecorators: true,
			inlineSources: true,
			lib: [ // All of them
				'dom',
				'es2015',
				'es2016',
				'es2017',
				'esnext'
			],
			module: 'ES2015',
			moduleResolution: 'node',
			newLine: 'LF', // Necessary to make closure compiler annotations work correctly
			outDir: destinationPath,
			rootDir: sourcePath,
			sourceMap: true,
			sourceRoot: sourcePath,
			target,
			typeRoots: [
				'node_modules/@types'
			],
			types: []
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
