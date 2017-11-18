// Import and run Angular Pacakge Builder
( async() => {
    const angularPackageBuilder = await import( './index' );
    angularPackageBuilder.main();
} )();
