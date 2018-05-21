import { ModuleFormat } from 'rollup';

/**
 * Rollup bundling targets, map from Angular-terms to Rollup-terms
 */
export const rollupBundlingTargets: { [ target: string ]: ModuleFormat } = {
    fesm2015: 'es',
    fesm5: 'es',
    umd: 'umd'
};
