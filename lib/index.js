'use strict';
module.exports = (function () {
	var pluginName = 'colm',
		hoek       = require('hoek'),
		findit     = require('findit'),
		Promise    = require("bluebird"),
		path       = require('path'),
		defaults   = {
			base: './'
		};

	function getPromise(mainPath, scope, flat, registerCb) {
		return new Promise(function (resolve, reject) {
			var finder = findit(mainPath);
			finder.on('file', function colmFile(file/*, stat*/) {
				var parts, base,
					localScope = scope,
					ext = path.extname(file);

				parts   = path.dirname(file).substring(mainPath.length).split('/');
				base    = path.basename(file, ext);
				if ( !flat ) {
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


	function register (plugin, options, next) {
		var settings = hoek.clone(defaults);

		hoek.merge(settings, options);
		settings.base = path.normalize(settings.base);

		plugin.expose('load', function colmLoader(loadPath, scope, flat, registerCb, cb){
			var mainPath = path.join(settings.base, loadPath),
				promise ;
			if (typeof scope === 'function') {
				cb = flat;
				registerCb = scope;
				flat = true;
			} else if (typeof flat === 'function') {
				cb = registerCb;
				registerCb = flat;
				flat = false;
			}

			promise = getPromise(mainPath, scope, flat, registerCb);
			if (cb) {
				promise.then( cb.bind(null, null), cb);
			}
			return promise;
		});

		next();
	}

	register.attributes = {
		pkg: require('../package.json'),
		name: pluginName
	};

	return { register: register};
}());