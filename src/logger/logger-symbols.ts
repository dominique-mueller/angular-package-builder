import { isWindows } from "../utilities/is-windows";

/**
 * Logger symbols
 */
export const loggerSymbols: { [ name: string ]: string } = {
    arrow: isWindows() ? '→' : '➜',
    tick: isWindows() ? '√' : '✔',
    pointer: isWindows() ? '>' : '❯'
};
