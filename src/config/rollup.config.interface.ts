import { Options, GenerateOptions } from 'rollup';

/**
 * Rollup Input Config (similar to 'Options' yet with the latest definitions)
 */
export interface RollupInputConfig {
	acorn?: Options[ 'acorn' ];
	cache?: Options[ 'cache' ];
	context?: Options[ 'context' ];
	external?: Options[ 'external' ];
	input: Options[ 'entry' ]; // Previously 'entry'
	legacy?: Options[ 'legacy' ];
	moduleContext?: Options[ 'moduleContext' ];
	onwarn?: Options[ 'onwarn' ];
	paths?: Options[ 'paths' ];
	plugins?: Options[ 'plugins' ];
	treeshake?: Options[ 'treeshake' ];
}

/**
 * Rollup Output Config (similar to 'GenerateOptions' yet with the latest efinitions)
 */
export interface RollupOutputConfig {
	banner?: GenerateOptions[ 'banner' ];
	exports?: GenerateOptions[ 'exports' ];
	footer?: GenerateOptions[ 'footer' ];
	format?: GenerateOptions[ 'format' ];
	globals?: GenerateOptions[ 'globals' ];
	indent?: GenerateOptions[ 'indent' ];
	interop?: GenerateOptions[ 'interop' ];
	intro?: GenerateOptions[ 'intro' ];
	moduleId?: GenerateOptions[ 'moduleId' ];
	name?: GenerateOptions[ 'moduleName' ]; // Previously 'moduleName'
	outro?: GenerateOptions[ 'outro' ];
	sourcemap?: GenerateOptions[ 'sourceMap' ]; // Previously 'sourceMap'
	sourceMapFile?: GenerateOptions[ 'sourceMapFile' ];
	useStrict?: GenerateOptions[ 'useStrict' ];
}
