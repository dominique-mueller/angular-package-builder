/**
 * Rollup Module Helper
 *
 * Inspired by: https://github.com/gund/rollup-globals-regex/blob/master/src/templates/index.ts
 */
export class RollupModuleHelper {

    private static rxjs6Globals: any = {
        'rxjs': 'rxjs',
        'rxjs/operators': 'rxjs.operators',
        'rxjs/webSocket': 'rxjs.webSocket',
        'rxjs/ajax': 'rxjs.ajax',
        'rxjs/testing': 'rxjs.testing'
    };

    private static rxjsGlobals: any = {

        // RxJS 5.x
        '^rxjs/(add/)?observable': 'Rx.Observable',
        '^rxjs/(add/)?operator': 'Rx.Observable.prototype',
        '^rxjs/scheduler': 'Rx.Scheduler',
        '^rxjs/symbol': 'Rx.Symbol',

        // Fallback
        '^rxjs/[^/]+$': 'Rx'

    };

    /**
     * Check if the given module ID
     *
     * @param   moduleName        Module name
     * @param   knownDependencies List of known dependencies
     * @returns                   Flag, describing whether the given module name is an external module
     */
    public static isExternalModule( moduleName: string, knownDependencies: Array<string> ): boolean {
        return knownDependencies
            .some( ( knownDependency: string ): boolean => {
                return moduleName === knownDependency || moduleName.startsWith( `${ knownDependency }/` );
            } );
    }

    public static deriveModuleGlobalName( moduleName: string, knownDependenciesWithGlobalNames: { [ dependency: string ]: string | null } ): string {

        // TODO: Prefer known

        // Handle angular-related dependencies
        if ( moduleName.startsWith( '@angular' ) ) {
            return moduleName
                .replace( '@angular/', 'ng.' ) // Set global name
                .replace( /\//g, '.' ) // Replace slashes with dots
                .replace( /-([a-z])/g, ( value: string ): string => { // Convert hyphenated case into camel case
                    return value[ 1 ].toUpperCase();
                } );
        }

        // Handle RxJS-related dependencies
        if ( moduleName.startsWith( 'rxjs' ) ) {

            // TODO:

        }

        // TODO: tslib??

    }

}
