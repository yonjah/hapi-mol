# hapi-mol - DEPRECATED This module is no longer maintained

Simple module loader plugin for hapi.js

Mol allows you to easily manage your app across multiple files.
For a full guide see the examples.

## Install
```shell
npm install hapi-mol
```

## Usage
```javascript
var hapi   = require('hapi'),
	mol    = require('hapi-mol'),
	server = new hapi.Server({ debug: { request: ['error'] } });

server.connection({port: 8000});
server.register(mol, function (err){
	if (err) {
		throw err;
	}

	server.plugins.mol.load('controllers', function (path, base, ext, scope){
		var controller = require(path);
		server.route(controller);
	}).then(server.start.bind(server, function (err) {
		if (err) {
			console.error(err);
		} else {
			console.log('Server running at localhost:8000');
		}
	}));
});
```
Register mol as any other Hapi plugin.
You can pass the following configuration when registering the plugin -
- `base`  the base path from which each folder will be loaded  __default(`./`)__
- `tree` if true the scope passed to the `registerCb` will be a node of the original scope relative to the internal path __default(true)__

Mol exposes a `load` method on `server.plugins.mol`.
the `load` method recursively loads a folder under the `base` path
You can pass the folowing parameters to the `load` method -
- `loadPath`  - path to load files from
- `scope` (optional) - the scope object which will be passed to the register callback if `flat` is `false` scope will be relative to subfolders so when calling the register callback for 'base_path/foo/bar.js' scope will be scope['foo']
- `registerCb`  - the callback that will be called for each file in `loadPath`
- `cb  (optional) - callback to call once all files are loaded, since Mol uses promises you can leave it blank and just follow the promise chain

Since the `load` method return a Promise you don't have to pass a callback and you can just use the Promise chain.


`registerCb` is where the real magic should happen.
Mol will call `registerCb` for each file under `loadPath` and will pass the following parameters -
- `path' The load path of the current file under the `localPath`
- `base' the base name of the file (no path no extension)
- `ext' the extension of the file
- `localScope' the scope node the file belongs to (if tree is false the root scope)
- `parts` Array of folders under loadPath where the file is located


If you prefer you can use Mol as a regular library instead of a hapi plugin.
to do so Mol exposes a construction function you can use it as follows -
```javascript
var mol  = require('hapi-mol'),
	load = mol({base: './', tree: true});
load('controllers', function (path, base, ext, scope){
	//...
}).then(server.start.bind(server, function (err) {
	//...
}));

```
