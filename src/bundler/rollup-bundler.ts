import { posix as path } from 'path';

import { InputOptions, OutputOptions, OutputChunk, rollup } from 'rollup';
import { SourceMap } from 'magic-string';
import { writeFile } from '../utilities/write-file';

/**
 * Rollup Bundler
 */
export class RollupBundler {

    public static async bundle( inputOptions: InputOptions, outputOptions: OutputOptions, outDir: string ): Promise<void> {

        // Create bundle
        const bundle: OutputChunk = <OutputChunk> await rollup( inputOptions );

        // Generate bundle
	    const { code, map }: {
            code: string;
            map: SourceMap;
        } = await bundle.generate( outputOptions );

        // Write bundle and sourcemap to disk
        const fileName: string = `${ outputOptions.name }${ outputOptions.format === 'umd' ? '.umd' : '' }`;
        await Promise.all( [
            writeFile( path.join( outDir, `${ fileName }.js` ), code ),
            writeFile( path.join( outDir, `${ fileName }.js.map` ), map )
        ] );

    }

}
