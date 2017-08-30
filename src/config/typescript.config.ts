import { TypescriptConfig } from './typescript.config.interface';

/**
 * Get Typescript Config
 */
export function getTypescriptConfig(
	target: string,
	rootDir: string,
	outDir: string,
	flatModuleId: string,
	flatModuleOutFile: string,
	files: Array<string>
	): TypescriptConfig {

	return {
		compilerOptions: {
			declaration: true,
			emitDecoratorMetadata: true,
			experimentalDecorators: true,
			lib: [ // All of them
				'dom',
				'es2015',
				'es2016',
				'es2017',
				'esnext'
			],
			module: 'es2015',
			moduleResolution: 'node',
			outDir,
			rootDir,
			sourceMap: true,
			stripInternal: true,
			target,
			typeRoots: [
				'node_modules/@types'
			],
			types: []
		},
		files,
		angularCompilerOptions: {
			// annotateForClosureCompiler: true,
			flatModuleId,
			flatModuleOutFile,
			skipTemplateCodegen: true,
			strictMetadataEmit: true
		}
	};

}
