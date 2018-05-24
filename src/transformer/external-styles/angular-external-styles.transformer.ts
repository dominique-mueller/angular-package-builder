import { AngularExternalStyles, AngularExternalResource } from '../external-resources/angular-external-resources.interfaces';
import { CSSTransformer } from '../languages/css.transformer';
import { getFileType } from '../../utilities/get-file-type';
import { SASSTransformer } from '../languages/sass.transformer';

/**
 * Angular External Styles Transformer
 */
export class AngularExternalStylesTransformer {

    /**
     * Inline external styles (manipulates source code!)
     *
     * @param externalStyles External styles
     * @param template       Styles
     */
    public static async inlineExternalStyles( externalStyles: AngularExternalStyles, styles: Array<string> ): Promise<void> {

        // Prepare styles
        const preparedStyles: Array<string> = await Promise.all(
            styles.map( ( style: string, index: number ): Promise<string> => {
                return this.prepareStyle( style, getFileType( externalStyles.styles[ index ].path ) );
            } )
        );

        // Rewrite assignment
        externalStyles.node.replaceWithText( 'styles' );
        externalStyles.styles.forEach( ( style: AngularExternalResource, index: number ): void => {
            style.node.replaceWithText( `'${ preparedStyles[ index ] }'` );
        } );

    }

    /**
     * Prepare style
     *
     * @param   style    Style
     * @param   fileType File type
     * @returns          Prepared style
     */
    private static async prepareStyle( style: string, fileType: string ): Promise<string> {

        switch ( fileType ) {
            case 'css':
                return CSSTransformer.minify( style );
            case 'scss':
            case 'sass':
                return CSSTransformer.minify( await SASSTransformer.compileToCss( style ) );
            default:
                throw new Error( 'Unsupported file!' );
        }

    }

}
