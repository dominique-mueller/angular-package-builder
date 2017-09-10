/**
 * TypeScript Config Interface
 */
export interface TypescriptConfig {
	compilerOptions?: {
		charset?: string;
		declaration?: boolean;
		emitDecoratorMetadata?: boolean;
		experimentalDecorators?: boolean;
		lib?: Array<string>;
		module?: string;
		moduleResolution?: string;
		newLine?: 'CRLF' | 'LF';
		outDir?: string;
		pretty?: boolean;
		rootDir?: string;
		sourceMap?: boolean;
		sourceRoot?: string;
		target?: string;
		typeRoots?: Array<string>;
		[ key: string ]: any;
	};
	files?: Array<string>;
	angularCompilerOptions?: {
		annotateForClosureCompiler?: boolean;
		flatModuleId?: string;
		flatModuleOutFile?: string;
		skipTemplateCodegen?: boolean;
		strictMetadataEmit?: boolean;
	};
}
