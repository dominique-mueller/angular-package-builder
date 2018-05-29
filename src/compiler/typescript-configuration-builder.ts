import * as deepmerge from 'deepmerge';

import { typescriptCompilationTargets } from './typescript-compilation-targets';
import { getFileNameByPackageName } from '../utilities/get-file-name-by-package-name';

/**
 * TypeScript Configuartion Builder
 */
export class TypeScriptConfigurationBuilder {

	/**
	 * List of entry files
	 */
	private files: Array<string>;

	/**
	 * TypeScript compiler options
	 */
	private typescriptCompilerOptions: { [ option: string ]: any };

	/**
	 * Angular compiler options
	 */
	private angularCompilerOptions: { [ option: string ]: any };

	/**
	 * Constructor
	 */
	constructor() {
		this.typescriptCompilerOptions = {
			baseUrl: '', // Necessary when using paths
			declaration: true, // Emit TypeScript definition files (*.d.ts) for JavaScript type checking
			emitDecoratorMetadata: true, // Keep metadata about decorators
			experimentalDecorators: true, // Enable decorators
			lib: [ // Defaults (see https://www.typescriptlang.org/docs/handbook/compiler-options.html)
				'es6',
				'dom',
				'dom.iterable',
				'scripthost'
			],
			inlineSources: true, // Include original source code in sourcemaps
			module: 'ES2015', // Always generate ES6 modules, meaning we use 'import' and 'export'
			moduleResolution: 'node', // Module resolution strategy
			newLine: 'LF', // Always use 'LF' as line endings in order to make closure compiler annotations work correctly
			pretty: true, // Pretty error messages
			sourceMap: true // Emit sourcemap files
		};
		this.files = [];
		this.angularCompilerOptions = {
			annotateForClosureCompiler: true, // Generate specific annoation
			preserveWhitespaces: false, // Remove whitespaces for smaller bundles (#perfmatters)
			skipTemplateCodegen: true, // Do not pre-compile templates
			strictMetadataEmit: true // Validate emitted metadata
		};
	}

	/**
	 * Set entry file & directory
	 *
	 * @param   entryFile Entry file
	 * @param   entryDir  Entry directory
	 * @returns           This instance of the TypeScript configuration builder
	 */
	public setEntry( entryFile: string, entryDir: string ): TypeScriptConfigurationBuilder {
		this.files.push( entryFile );
		return this;
	}

	/**
	 * Set output directory
	 *
	 * @param   outDir Output directory
	 * @returns        This instance of the TypeScript configuration builder
	 */
	public setOutDir( outDir: string ): TypeScriptConfigurationBuilder {
		this.typescriptCompilerOptions.outDir = outDir;
		return this;
	}

	/**
	 * Set package name
	 *
	 * @param   packageName Package name
	 * @returns             This instance of the TypeScript configuration builder
	 */
	public setPackageName( packageName: string ): TypeScriptConfigurationBuilder {
		this.angularCompilerOptions.flatModuleId = packageName; // Name of the package, used when importing from the library
		this.angularCompilerOptions.flatModuleOutFile = `${ getFileNameByPackageName( packageName ) }.js`; // Name of the output file, including file type
		return this;
	}

	/**
	 * Set compilation target
	 *
	 * @param   target Compilation target
	 * @returns        This instance of the TypeScript configuration builder
	 */
	public setCompilationTarget( target: 'esm2015' | 'esm5' ): TypeScriptConfigurationBuilder {
		this.typescriptCompilerOptions.target = typescriptCompilationTargets[ target ];
		return this;
	}

	/**
	 * Set custom TypeScript compiler options
	 *
	 * @param   typescriptCompilerOptions Custom TypeScript compiler options
	 * @returns                           This instance of the TypeScript configuration builder
	 */
	public setCustomTypescriptCompilerOptions( typescriptCompilerOptions: { [ option: string ]: any } ): TypeScriptConfigurationBuilder {
		this.typescriptCompilerOptions = deepmerge(
			typescriptCompilerOptions,
			this.typescriptCompilerOptions
		);
		return this;
	}

	/**
	 * Set custom Angular compiler options
	 *
	 * @param   angularCompilerOptions Custom Angular compiler options
	 * @returns                        This instance of the TypeScript configuration builder
	 */
	public setCustomAngularCompilerOptions( angularCompilerOptions: { [ option: string ]: any } ): TypeScriptConfigurationBuilder {
		this.angularCompilerOptions = deepmerge(
			angularCompilerOptions,
			this.angularCompilerOptions
		);
		return this;
	}

	/**
	 * Build
	 *
	 * @returns TypeScript configuration
	 */
	public build(): {
		compilerOptions: { [ option: string ]: any },
		files: Array<string>,
		angularCompilerOptions: { [ option: string ]: any }
	} {
		return {
			compilerOptions: this.typescriptCompilerOptions,
			files: this.files,
			angularCompilerOptions: this.angularCompilerOptions
		};
	}

}
