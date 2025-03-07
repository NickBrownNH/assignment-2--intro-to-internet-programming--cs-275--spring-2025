const { src, dest, series, watch } = require(`gulp`),
    htmlCompressor = require(`gulp-htmlmin`),
    CSSLinter = require(`gulp-stylelint`),
    htmlValidator = require(`gulp-html`),
    jsLinter = require(`gulp-eslint`),
    browserSync = require(`browser-sync`),
    babel = require(`gulp-babel`),
    jsCompressor = require(`gulp-uglify`),
    cleanCSS = require(`gulp-clean-css`),
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
    return src(`js/*.js`)
        .pipe(babel())
        .on(`error`, (err) => {
            console.error(`Babel error:`, err);
        })
        .pipe(dest(`./temp/js`))
        .on(`end`, () => {
            console.log(`Transpilation complete. Files saved to ./temp/js`);
        });
};

let compressImages = async () => {
    const imageCompressor = (await import(`gulp-image`)).default;
    return src(`img/**/*`)
        .pipe(imageCompressor({
            optipng: [`-i 1`, `-strip all`, `-fix`, `-o7`, `-force`],
            pngquant: [`--speed=1`, `--force`, 256],
            zopflipng: [`-y`, `--lossy_8bit`, `--lossy_transparent`],
            jpegRecompress: [`--strip`, `--quality`, `medium`, `--min`, 40,
                `--max`, 80],
            mozjpeg: [`-optimize`, `-progressive`],
            gifsicle: [`--optimize`],
            svgo: [`--enable`, `cleanupIDs`, `--disable`, `convertColors`],
            quiet: false
        }))
        .pipe(dest(`prod/img`));
};

let transpileJSForProd = () => {
    return src(`js/*.js`)
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(dest(`prod/js`));
};

let compressCSS = () => {
    return src(`styles/*.css`)
        .pipe(cleanCSS({compatibility: `ie8`}))
        .pipe(dest(`prod/styles`));
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

async function clean() {
    const { deleteAsync } = await import(`del`);
    let fs = require(`fs`),
        foldersToDelete = [`./temp`, `prod`];

    for (let folder of foldersToDelete) {
        try {
            fs.accessSync(folder, fs.F_OK);
            process.stdout.write(`\n\tThe ${folder} directory was found and will be deleted.\n`);
        } catch (e) {
            process.stdout.write(`\n\tThe ${folder} directory does NOT exist or is NOT accessible.\n`);
            continue;
        }

        await deleteAsync(folder);
    }

    process.stdout.write(`\n`);
}

exports.compressHTML = compressHTML;
exports.lintCSS = lintCSS;
exports.validateHTML = validateHTML;
exports.lintJS = lintJS;
exports.transpileJSForDev = transpileJSForDev;
exports.compressImages = compressImages;
exports.serve = serve;
exports.clean = clean;
exports.compressCSS = compressCSS;
exports.transpileJSForProd = transpileJSForProd;
exports.build = series(
    compressHTML,
    compressCSS,
    transpileJSForProd,
    compressImages,
);
