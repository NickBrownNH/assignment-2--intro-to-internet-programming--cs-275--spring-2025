const { src, dest, series, watch } = require(`gulp`),
    htmlCompressor = require(`gulp-htmlmin`),
    CSSLinter = require(`gulp-stylelint`),
    htmlValidator = require(`gulp-html`),
    jsLinter = require(`gulp-eslint`),
    browserSync = require(`browser-sync`),
    babel = require(`gulp-babel`),
    reload = browserSync.reload;

let compressHTML = () => {
    return src(`*.html`)
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod/`));
};

let lintCSS = () => {
    return src(`styles/**/*.css`)
        .pipe(CSSLinter({
            failAfterError: false,
            reporters: [
                {formatter: `string`, console: true}
            ]
        }));
};

let validateHTML = () => {
    return src([`*.html`])
        .pipe(htmlValidator(undefined));
};

let lintJS = () => {
    return src(`js/*.js`)
        .pipe(jsLinter())
        .pipe(jsLinter.formatEach(`compact`));
};

let transpileJSForDev = () => {
    return src('js/*.js')
        .pipe(babel())
        .on('error', (err) => {
            console.error('Babel error:', err);
        })
        .pipe(dest('./temp/js'))
        .on('end', () => {
            console.log('Transpilation complete. Files saved to ./temp/js');
        });
};

let serve = () => {
    browserSync({
        notify: true,
        reloadDelay: 50,
        browser: `default`,
        server: {
            baseDir: [
                `js`,
                `styles`,
                `.`
            ]
        }
    });

    watch(`js/*.js`, series(lintJS, transpileJSForDev))
        .on(`change`, reload);

    watch(`styles/**/*.css`, lintCSS)
        .on(`change`, reload);

    watch(`*.html`, validateHTML)
        .on(`change`, reload);

    watch(`img/**/*`)
        .on(`change`, reload);
};

exports.compressHTML = compressHTML;
exports.lintCSS = lintCSS;
exports.validateHTML = validateHTML;
exports.lintJS = lintJS;
exports.transpileJSForDev = transpileJSForDev;
exports.serve = serve;
