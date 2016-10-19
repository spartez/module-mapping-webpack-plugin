import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import webpack from 'webpack';
import ModuleMappingPlugin from '../';

const outputPath = path.resolve('../dist');

async function build(config) {
    return new Promise((resolve, reject) => webpack(config, (err, stats) => {
        if (err || stats.hasErrors()) {
            reject(err || stats.toJson('errors-only')
                .errors);
            return;
        }
        resolve(`${config.output.path}/${config.output.filename}`);
    }));
}

function createConfig(entry, pluginConfig) {
    return {
        entry,
        output: {
            path: outputPath,
            filename: `bundle_${Date.now()}.js`,
            library: 'test',
            libraryTarget: 'commonjs2'
        },
        resolve: {
            root: [path.resolve('./modules')]
        },
        module: {
            loaders: [
                { test: /\.html$/, loader: 'raw' }
            ]
        },
        plugins: [
            ModuleMappingPlugin(pluginConfig)
        ]
    };
}

function testPathType(pathType) {

    test(`should not map anything when using ${pathType} paths`, async t => {
        const bundlePath = await build(createConfig(`./modules/index-${pathType}.js`, {}));
        const testModule = require(bundlePath);
        t.is(testModule.fn(), 'foo');
    });


    test(`should map foo.js to bar.js when using ${pathType} paths`, async t => {
        const bundlePath = await build(createConfig(`./modules/index-${pathType}.js`, {
            './modules/foo.js': './modules/bar.js'
        }));
        const testModule = require(bundlePath);
        t.is(testModule.fn(), 'bar');
        t.is(testModule.html.trim(), '<div>foo</div>');
    });


    test(`should map foo.html to bar.html when using ${pathType} paths`, async t => {
        const bundlePath = await build(createConfig(`./modules/index-${pathType}.js`, {
            './modules/foo.html': './modules/bar.html'
        }));
        const testModule = require(bundlePath);
        t.is(testModule.fn(), 'foo');
        t.is(testModule.html.trim(), '<div>bar</div>');
    });


    test(`should map both foo.js and foo.html when using ${pathType} paths`, async t => {
        const bundlePath = await build(createConfig(`./modules/index-${pathType}.js`, {
            './modules/foo.js': './modules/bar.js',
            './modules/foo.html': './modules/bar.html'
        }));
        const testModule = require(bundlePath);
        t.is(testModule.fn(), 'bar');
        t.is(testModule.html.trim(), '<div>bar</div>');
    });

}

testPathType('relative');
testPathType('absolute');
testPathType('module');

test.after.always('cleanup dist folder', t => fs.remove(outputPath));
