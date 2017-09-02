import { Options, WriteOptions } from 'rollup';

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
 * Rollup Output Config (similar to 'RollupWriteOptions' yet with the latest efinitions)
 */
export interface RollupOutputConfig {
	banner?: WriteOptions[ 'banner' ];
	exports?: WriteOptions[ 'exports' ];
	file: WriteOptions[ 'dest' ]; // Previously 'dest'
	footer?: WriteOptions[ 'footer' ];
	format?: WriteOptions[ 'format' ];
	globals?: WriteOptions[ 'globals' ];
	indent?: WriteOptions[ 'indent' ];
	interop?: WriteOptions[ 'interop' ];
	intro?: WriteOptions[ 'intro' ];
	moduleId?: WriteOptions[ 'moduleId' ];
	moduleName?: WriteOptions[ 'moduleName' ];
	outro?: WriteOptions[ 'outro' ];
	sourcemap?: WriteOptions[ 'sourceMap' ]; // Previously 'sourceMap'
	sourceMapFile?: WriteOptions[ 'sourceMapFile' ];
	useStrict?: WriteOptions[ 'useStrict' ];
}
