const path = require('path');

function ModuleMappingPlugin(mappings) {
    const absoluteMappings = Object.keys(mappings)
        .reduce((current, key) => Object.assign({}, current, {
            [path.resolve(key)]: path.resolve(mappings[key])
        }), {});

    const mappingExists = data => !!absoluteMappings[data.resource];

    const overrideResource = data => Object.assign({}, data, {
        userRequest: absoluteMappings[data.resource],
        resource: absoluteMappings[data.resource]
    });

    return {
        apply: compiler => {
            compiler.plugin('normal-module-factory', moduleFactory => {
                moduleFactory.plugin('after-resolve', (data, callback) => {
                    mappingExists(data) ? callback(null, overrideResource(data)) : callback(null, data);
                });
            });
        }
    };
}

module.exports = ModuleMappingPlugin;
