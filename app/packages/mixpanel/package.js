Package.describe({
	name: 'mixpanel',
	summary: 'A local mixpanel package for local project'
});

Package.on_use(function (api) {
	/* Use or imply other packages.

	 * Example:
	 *  api.use('ui', 'client');
	 *  api.use('iron-router', ['client', 'server']);
	 */

	/*
	 * Add files that should be used with this
	 * package.
	 */
	api.add_files('mixpanel.js', ['client']);

	/*
	 * Export global symbols.
	 *
	 * Example:
	 *  api.export('GlobalSymbol');
	 */
});

Package.on_test(function (api) {
	api.use('mixpanel');
	api.use('tinytest');

	api.add_files('mixpanel_tests.js');
});