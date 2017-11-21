// Import and run Angular Pacakge Builder
( async() => {
    try {
        const runAngularPackageBuilder = ( await import( './../index' ) ).runAngularPackageBuilder;
        await runAngularPackageBuilder();
    } catch( error ) {
        console.error( error );
    }
} )();
