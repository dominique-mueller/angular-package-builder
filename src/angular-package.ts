import { posix as path } from 'path';
import { AngularPackageConfig, AngularSubPackageConfig } from './config.interface';
import { readFile } from './utilities/read-file';

// TODO: Find a better name?
export interface AngularPackageConfigInternal {
    entryFile: string;
    outDir: string;
    packageName: string;
    fileName: string;
}

/**
 * Angular Package
 */
export class AngularPackage {

	/**
	 * Angular Package project directory
	 */
    private cwd: string;

	/**
	 * Primary entry point
	 */
    public entry: AngularPackageConfigInternal;

	/**
	 * Secondary entry points
	 */
    public secondaryEntries: Array<AngularPackageConfigInternal>;

	/**
	 * Custom TypeScript compiler options
	 */
    public typescriptCompilerOptions: { [ option: string ]: any };

	/**
	 * Custom Angular compiler options
	 */
    public angularCompilerOptions: { [ option: string ]: any };

    public async withConfig( absoluteAngularPackageJsonPath: string ): Promise<void> {

        this.cwd = path.dirname( absoluteAngularPackageJsonPath );

        // Read files
        // TODO: Error handling
        const angularPackageJson: AngularPackageConfig = await readFile( absoluteAngularPackageJsonPath );
        const absolutePackageJsonPath: string = path.join( this.cwd, 'package.json' );
        const packageJson: any = await readFile( absolutePackageJsonPath );

        // Get primary entry information
        const entryFile: string = path.join( this.cwd, angularPackageJson.entryFile );
        const fileName: string = packageJson.name.split( '/' ).pop();
        const outDir: string = path.join( this.cwd, angularPackageJson.outDir );
        const packageName: string = packageJson.name;
        this.entry = { entryFile, fileName, outDir, packageName };

        // Get secondary entry information
        this.secondaryEntries = ( angularPackageJson.secondaryEntries || [] )
            .map( ( secondaryEntry: AngularSubPackageConfig ): AngularPackageConfigInternal => {
                const entryFile: string = path.join( this.cwd, secondaryEntry.entryFile );
                const secondaryEntryDir: string = path.relative( path.dirname( this.entry.entryFile ), path.dirname( entryFile ) );
                const packageName: string = path.join( this.entry.packageName, secondaryEntryDir );
                const fileName: string = packageName.split( '/' ).pop();
                const outDir: string = path.join( this.entry.outDir, secondaryEntryDir );
                return { entryFile, fileName, outDir, packageName };
            } );

        // Get compiler options
        this.typescriptCompilerOptions = angularPackageJson.typescriptCompilerOptions || {};
        this.angularCompilerOptions = angularPackageJson.angularCompilerOptions || {};

        // TODO: Dependencies
        // TODO: Angular Package JSON Schema Validation
        // TODO: Error Handling

    }

}
