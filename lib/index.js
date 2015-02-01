'use strict';
module.exports = (function () {
	var pluginName = 'mol',
		hoek       = require('hoek'),
		findit     = require('findit'),
		Promise    = require('bluebird'),
		path       = require('path'),
		defaults   = {
			tree: true,
			base: './'
		};

	function getPromise(mainPath, tree, scope, registerCb) {
		return new Promise(function (resolve, reject) {
			var finder = findit(mainPath);
			finder.on('file', function colmFile(file/*, stat*/) {
				var parts, base,
					localScope = scope,
					ext = path.extname(file),
					localPath = path.dirname(file).substring(mainPath.length);

				parts = localPath.split('/');
				parts[0] === '' && parts.shift();
				base  = path.basename(file, ext);
				if ( tree ) {
					localScope   = parts.reduce(function (scope, part){
						if (part) {
							scope[part] = scope[part] || {};
							return scope[part];
						} else {
							return scope;
						}
					}, scope);
				}
				return registerCb(path.resolve(file), base, ext, localScope, parts);
			});

			finder.on('error', reject);
			finder.on('end', resolve);
		});
	}

	function colmLoader(settings, loadPath, scope, registerCb, cb){
		var mainPath = path.join(settings.base, loadPath),
			promise ;
		if (typeof scope === 'function') {
			cb = registerCb;
			registerCb = scope;
			scope = {};
		}

		promise = getPromise(mainPath, settings.tree,  scope, registerCb);
		if (cb) {
			promise.then( cb.bind(null, null), cb);
		}
		return promise;
	}

	function mkLoader(options) {
		var settings = hoek.clone(defaults);
		hoek.merge(settings, options);
		settings.base = path.normalize(settings.base);
		return colmLoader.bind(null, settings);
	}

	function register (plugin, options, next) {
		plugin.expose('load', mkLoader(options));
		next();
	}

	register.attributes = {
		pkg: require('../package.json'),
		name: pluginName
	};

	mkLoader.register = register;
	return mkLoader;
}());