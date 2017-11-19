/**
 * TypeScript Config Interface
 */
export interface TypescriptConfig {
	compilerOptions?: {
		declaration?: boolean;
		diagnostics?: boolean;
		emitDecoratorMetadata?: boolean;
		experimentalDecorators?: boolean;
		lib?: Array<string>;
		listEmittedFiles?: boolean;
		listFiles?: boolean;
		module?: string;
		moduleResolution?: string;
		newLine?: string;
		outDir?: string;
		pretty?: boolean;
		rootDir?: string;
		sourceMap?: boolean;
		sourceRoot?: string;
		target?: string;
		traceResolution?: boolean;
		[ key: string ]: any;
	};
	files?: Array<string>;
	angularCompilerOptions?: {
		annotateForClosureCompiler?: boolean;
		flatModuleId?: string;
		flatModuleOutFile?: string;
		preserveWhitespaces?: boolean;
		skipTemplateCodegen?: boolean;
		strictMetadataEmit?: boolean;
		[ key: string ]: any;
	};
}
