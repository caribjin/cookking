var imageStore = new FS.Store.FileSystem('images', {
	path: App.settings.defaultFileStoragePath
});

var imageThumbStore = new FS.Store.FileSystem('thumbs', {
	path: App.settings.defaultFileStoragePath + 'thumbs/',
	transformWrite: function(file, readStream, writeStream) {
		if (file.cropData) {
			gm(readStream, file.name)
				//autoOrient().
				//gravity('Center')
				//resize(App.settings.thumbnailImageWidth, App.settings.thumbnailImageHeight, '^')
				.crop(file.cropData.width, file.cropData.height, file.cropData.x, file.cropData.y)
				.quality(App.settings.thumbnailImageQuality)
				.stream()
				.pipe(writeStream);
		} else {
			gm(readStream, file.name)
				.autoOrient()
				.gravity('Center')
				.resize(App.settings.thumbnailImageWidth, App.settings.thumbnailImageHeight, '^')
				.quality(App.settings.thumbnailImageQuality)
				.stream()
				.pipe(writeStream);
		}
	}
});

Images = new FS.Collection('images', {
	stores: [
		imageStore,
		imageThumbStore
	],
	filter: {
		maxsize: App.settings.uploadMaxLimitSize,
		allow: {
			contentTypes: ['image/*'],
			extensions: App.settings.uploadLimitExtensions.images
		},
		deny: {},
		onInvalid: function(message) {
			if (Meteor.isClient) {
				alert('Error: ' + message);
			} else {
				alert('Error: ' + message);
			}
		}
	}
});
