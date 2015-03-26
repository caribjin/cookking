Package.describe({
    name: 'caribjin:jquery-waypoints',
    summary: 'imakewebthings/waypoints package for meteor.',
    version: '0.1.0',
    git: 'https://github.com/imakewebthings/waypoints'
});

Package.on_use(function (api) {
    api.use('jquery', 'client');

    api.add_files([
        'waypoints/lib/jquery.waypoints.js',
        'waypoints/lib/shortcuts/infinite.js',
        'waypoints/lib/shortcuts/inview.js',
        'waypoints/lib/shortcuts/sticky.js'
    ], ['client']);
});