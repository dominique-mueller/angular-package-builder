/**
 * TypeScript Config Interface
 */
export interface TypescriptConfig {
	compilerOptions?: {
		declaration?: boolean;
		emitDecoratorMetadata?: boolean;
		experimentalDecorators?: boolean;
		inlineSources?: boolean;
		lib?: Array<string>;
		module?: string;
		moduleResolution?: string;
		outDir?: string;
		rootDir?: string;
		sourceMap?: boolean;
		target?: string;
		typeRoots?: Array<string>;
		types?: Array<string>;
	};
	files?: Array<string>;
	angularCompilerOptions?: {
		annotateForClosureCompiler?: boolean;
		debug?: boolean;
		flatModuleId?: string;
		flatModuleOutFile?: string;
		skipTemplateCodegen?: boolean;
		strictMetadataEmit?: boolean;
	};
}
