import { inlineResources } from './src/tasks/inline-resources';

import { resolvePath } from './src/utilities/resolve-path';

export interface AngularPackageBuilderConfig {
	folders: {
		entry: string;
		output: string;
		temporary: {
			root: string;
			inline: string;
			buildES5: string;
			buildES2015: string;
			bundles: string;
		}
	}
}

const config: AngularPackageBuilderConfig = {
	folders: {
		entry: resolvePath( 'example-library/lib' ),
		output: resolvePath( 'dist' ),
		temporary: {
			root: resolvePath( 'dist-temp' ),
			inline: resolvePath( 'dist-temp/library-inline' ),
			buildES5: resolvePath( 'dist-temp/library-es5' ),
			buildES2015: resolvePath( 'dist-temp/library-es2016' ),
			bundles: resolvePath( 'dist-temp/library-bundles' )
		}
	}
};

inlineResources( config );
