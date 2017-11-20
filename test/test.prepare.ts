// Import and run Angular Pacakge Builder
( async() => {
    try {
        const angularPackageBuilder = await import( './../index' );
        await angularPackageBuilder.main();
    } catch( error ) {
        console.error( error );
    }
} )();
