import test from 'ava';
import path from 'path';
import ModuleMappingPlugin from '../';

function mock(pluginFn) {
    return {
        plugin: pluginFn
    };
}

function handleRequest(fn, request) {
    return new Promise((resolve, reject) => fn({
        userRequest: request,
        resource: request
    }, (err, data) => {
        if (err) {
            reject(err);
        } else {
            resolve(data);
        }
    }));
}

test.cb('should map foo.js to bar.js', t => {
    const plugin = ModuleMappingPlugin({
        './foo.js': './bar.js'
    });

    const input = [{
        request: path.resolve('./foo.js'),
        expected: path.resolve('./bar.js')
    }];

    const moduleFactory = mock((name, fn) => {
        t.is(name, 'after-resolve');
        Promise.all(
                input.map(({ request, expected }) =>
                    handleRequest(fn, request)
                    .then(data => {
                        t.is(data.userRequest, expected);
                        t.is(data.resource, expected);
                    })
                ))
            .then(() => t.end())
            .catch(t.end);
    });

    const compiler = mock((name, fn) => {
        t.is(name, 'normal-module-factory');
        fn(moduleFactory);
    })

    plugin.apply(compiler);
});
