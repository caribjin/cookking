App.info({
	name: 'Cookking',
	description: '',
	author: 'devcrow',
	email: 'caribjin@devcrow.com',
	website: 'http://cookking.devcrow.com',
	version: '0.7.0'
});

App.icons({
	// iOS
	//'iphone': 'resources/icons/icon-60x60.png',
	//'iphone_2x': 'resources/icons/icon-60x60@2x.png',
	//'ipad': 'resources/icons/icon-72x72.png',
	//'ipad_2x': 'resources/icons/icon-72x72@2x.png',

	// Android
	'android_ldpi': 'resources/icons/icon-36x36.png',
	'android_mdpi': 'resources/icons/icon-48x48.png',
	'android_hdpi': 'resources/icons/icon-72x72.png',
	'android_xhdpi': 'resources/icons/icon-96x96.png'
});

App.launchScreens({
	// iOS
	//'iphone': 'resources/splash/splash-320x480.png',
	//'iphone_2x': 'resources/splash/splash-320x480@2x.png',
	//'iphone5': 'resources/splash/splash-320x568@2x.png',
	//'ipad_portrait': 'resources/splash/splash-768x1024.png',
	//'ipad_portrait_2x': 'resources/splash/splash-768x1024@2x.png',
	//'ipad_landscape': 'resources/splash/splash-1024x768.png',
	//'ipad_landscape_2x': 'resources/splash/splash-1024x768@2x.png',

	// Android
	'android_ldpi_portrait': 'resources/splash/splash-240x320.png',
	'android_mdpi_portrait': 'resources/splash/splash-320x480.png',
	'android_hdpi_portrait': 'resources/splash/splash-480x800.png',
	'android_xhdpi_portrait': 'resources/splash/splash-960x1600.png'
});

App.setPreference('StatusBarOverlaysWebView', 'false');
App.setPreference('StatusBarBackgroundColor', '#000000');
App.setPreference('HideKeyboardFormAccessoryBar', 'true');
App.setPreference('Orientation', 'portrait');

App.accessRule('*', {external: true});
App.accessRule('https://pbs.twimg.com/profile_images/*', {external: true});