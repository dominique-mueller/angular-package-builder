// Import and run Angular Pacakge Builder
( async() => {
    try {
        const runAngularPackageBuilder = ( await import( './../index' ) ).runAngularPackageBuilder;
        await runAngularPackageBuilder( '.angular-package.json', true );
    } catch( error ) {
        console.error( error );
    }
} )();
