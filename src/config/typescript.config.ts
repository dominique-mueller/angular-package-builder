import { AngularPackageBuilderInternalConfig } from '../internal-config.interface';
import { Logger } from '../logger/logger';

/**
 * TypeScript targets
 */
const typescriptTargets: { [ target: string ]: string } = {
	esm2015: 'ES2015',
	esm5: 'ES5'
};

/**
 * Get Typescript Config
 */
export function getTypescriptConfig( target: 'esm2015' | 'esm5', destinationPath: string, files: Array<string>,
	config: AngularPackageBuilderInternalConfig ): TypescriptConfig {

	return {
		compilerOptions: {
			...{
				declaration: true, // Emit TypeScript definition files (*.d.ts) for JavaScript type checking
				emitDecoratorMetadata: true, // Keep metadata about decorators
				experimentalDecorators: true, // Enable decorators
				lib: [ // Defaults (see https://www.typescriptlang.org/docs/handbook/compiler-options.html)
					'es6',
					'dom',
					'dom.iterable',
					'scripthost'
				],
				module: 'ES2015', // Always generate ES6 modules, meaning use 'import' and 'export'
				moduleResolution: 'node', // Module resolution strategy
				newLine: 'LF', // Always use 'LF' as line endings in order to make closure compiler annotations work correctly
				outDir: destinationPath,
				pretty: true, // Pretty error messages
				rootDir: config.temporary.transformed,
				sourceMap: true, // Emit sourcemap files
				sourceRoot: config.temporary.transformed,
				target: typescriptTargets[ target ]
			},
			...validateTypescriptCompilerOptions( config.typescriptCompilerOptions )
		},
		files,
		angularCompilerOptions: {
			...{
				annotateForClosureCompiler: true, // Generate specific annoation (only works with 'LF' line endings)
				flatModuleId: config.packageName, // Name of the package, used when importing from the library
				flatModuleOutFile: `${ config.fileName }.js`, // Name of the output file
				preserveWhitespaces: false, // Remove whitespaces for smaller bundles (#perfmatters)
				skipTemplateCodegen: true, // Do not pre-compile templates
				strictMetadataEmit: true // Validate emitted metadata
			},
			...validateAngularCompilerOptions( config.angularCompilerOptions )
		}
	};

}

/**
 * Validate (and correct) TypeScript compiler options
 */
function validateTypescriptCompilerOptions( typescriptCompilerOptions: { [ option: string ]: any } ): { [ option: string ]: any } {

	const typescriptCompilerOptionsBlacklist: Array<string> = [
		'declaration',
		'emitDecoratorMetadata',
		'experimentalDecorators',
		'module',
		'moduleResolution',
		'newLine',
		'outDir',
		'rootDir',
		'sourceRoot',
		'target'
	];
	const { newCompilerOptions, removedCompilerOptions } = validateOptions( typescriptCompilerOptions, typescriptCompilerOptionsBlacklist );

	if ( removedCompilerOptions.length > 0 ) {
		Logger.warn( `The TypeScript compiler option ${ removedCompilerOptions.join( ', ' ) } cannot be changed.` );
	}

	return newCompilerOptions;

}

/**
 * Validate (and correct) Angular compiler options
 */
function validateAngularCompilerOptions( angularCompilerOptions: { [ option: string ]: any } ): { [ option: string ]: any } {

	const angularCompilerOptionsBlacklist: Array<string> = [
		'flatModuleId',
		'flatModuleOutFile',
		'skipTemplateCodegen'
	];
	const { newCompilerOptions, removedCompilerOptions } = validateOptions( angularCompilerOptions, angularCompilerOptionsBlacklist );

	if ( removedCompilerOptions.length > 0 ) {
		Logger.warn( `The TypeScript compiler option ${ removedCompilerOptions.join( ', ' ) } cannot be changed.` );
	}

	return newCompilerOptions;

}

/**
 * Validate compiler options by a given blacklist of options
 */
function validateOptions( compilerOptions: { [ option: string ]: any }, compilerOptionsBlacklist: Array<string> ): {
	newCompilerOptions: { [ option: string ]: any },
	removedCompilerOptions: Array<string>
} {

	const removedCompilerOptions: Array<string> = [];
	const newCompilerOptions: { [ option: string ]: any } = Object
		.keys( compilerOptions )

		// Remove blacklisted compiler option keys
		.filter( ( compilerOption: string ): boolean => {
			const isValid: boolean = compilerOptionsBlacklist.indexOf( compilerOption ) === -1;
			if ( !isValid ) {
				removedCompilerOptions.push( compilerOption );
			}
			return isValid;
		} )

		// Re-create compiler options object
		.reduce( ( newCompilerOptions: { [ option: string ]: any }, compilerOption: string ): { [ option: string ]: any } => {
			newCompilerOptions[ compilerOption ] = compilerOptions[ compilerOption ];
			return newCompilerOptions;
		}, {} );

	return {
		newCompilerOptions,
		removedCompilerOptions
	};

}

/**
 * TypeScript Config Interface
 */
export interface TypescriptConfig {
	compilerOptions?: {
		declaration?: boolean;
		emitDecoratorMetadata?: boolean;
		experimentalDecorators?: boolean;
		lib?: Array<string>;
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

