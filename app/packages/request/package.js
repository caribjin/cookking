Package.describe({
	summary: "Wraps the request module from Npm in a fiber.",
	version: '0.0.0'
});

Npm.depends({request: "2.47.0"});

Package.onUse(function (api) {
	api.addFiles('requestServer.js', 'server');
	api.export('Request');
});
