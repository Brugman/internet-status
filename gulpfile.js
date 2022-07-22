/**
 * timbr.dev Gulp template.
 *
 * Template last updated: 2021-06-17.
 * File last updated:     2022-07-22.
 */

/**
 * Directories.
 */
var dir = {
    input: {
        less: 'less',
    },
    output: {
        less: 'public_html/assets',
    },
};

/**
 * Packages.
 */
var gulp         = require( 'gulp' );
var autoprefixer = require( 'gulp-autoprefixer' );
var cleancss     = require( 'gulp-clean-css' );
var filter       = require( 'gulp-filter' );
var gulpif       = require( 'gulp-if' );
var notify       = require( 'gulp-notify' );
var plumber      = require( 'gulp-plumber' );
var rename       = require( 'gulp-rename' );
var sourcemaps   = require( 'gulp-sourcemaps' );
var argv         = require( 'minimist' )( process.argv.slice( 2 ) );
var log          = require( 'fancy-log' );
// less
var less         = require( 'gulp-less' );

/**
 * Environment.
 */
var env = ( argv.env ? argv.env : 'dev' );

/**
 * Config.
 */
var config = {
    run_sourcemaps:   ( env == 'dev' ? true : false ),
    run_minification: ( env == 'dev' ? false : true ),
};

/**
 * Feedback.
 */
console.log( '' );
console.log( 'Environment:  '+( env == 'dev' ? 'Development' : 'Production' ) );
console.log( '' );
console.log( 'Sourcemaps:   '+( config.run_sourcemaps   ? 'Yes' : 'No' ) );
console.log( 'Minification: '+( config.run_minification ? 'Yes' : 'No' ) );
console.log( '' );

/**
 * Error handlers.
 */
var onErrorLess = function ( err ) {
    log( '------------------' );
    log( 'Less has an error!' );
    log( '------------------' );

    notify.onError({
        title: "Error in "+err.filename.replace( /^.*[\\\/]/, '' )+" on line "+err.line,
        message: err.extract,
        appID: "Gulp",
    })( err );

    log( '------------------' );

    this.emit('end');
};

/**
 * Procedures.
 */
var app = [];

app.processLess = function ( args ) {
    // use all the files
    return gulp.src( args.inputFiles )
        // catch errors
        .pipe( plumber( { errorHandler: onErrorLess } ) )
        // start the sourcemap
        .pipe( gulpif( config.run_sourcemaps, sourcemaps.init() ) )
        // compile the less to css
        .pipe( less() )
        // autoprefix the css
        .pipe( autoprefixer() )
        // minify the css
        .pipe( gulpif( config.run_minification, cleancss( { keepSpecialComments: 0 } ) ) )
        // name the output file
        .pipe( rename( args.outputFile ) )
        // finish the sourcemap
        .pipe( gulpif( config.run_sourcemaps, sourcemaps.write( '.' ) ) )
        // place the output file
        .pipe( gulp.dest( args.outputDir ) )
        // remove the sourcemap from the stream
        .pipe( gulpif( config.run_sourcemaps, filter( [ '**/*.css' ] ) ) );
};

/**
 * Tasks: Less.
 */
gulp.task( 'less_app', function ( done ) {
    app.processLess({
        'name'       : 'app less',
        'inputFiles' : [ dir.input.less+'/app.less' ],
        'outputDir'  : dir.output.less,
        'outputFile' : 'app.min.css',
    });
    done();
});

/**
 * Task: Watch.
 */
gulp.task( 'watch', function () {
    // Less
    gulp.watch( dir.input.less+'/**/*.less', gulp.parallel( 'less_app' ) );
    // notify
    gulp.src( 'node_modules/gulp-notify/test/fixtures/1.txt' ).pipe( notify({
        title: "Gulp watch is ready.",
        message: " ",
        appID: "Gulp",
    }));
});

/**
 * Task: Default.
 */
gulp.task( 'default', gulp.parallel(
    'less_app'
));

