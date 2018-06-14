import { isWindows } from '../utilities/is-windows';

/**
 * Logger symbols
 */
export const loggerSymbols: { [ name: string ]: string } = {
    arrow: isWindows() ? '→' : '➜',
    error: 'X',
    tick: isWindows() ? '√' : '✔',
    pointer: isWindows() ? '>' : '❯'
};
