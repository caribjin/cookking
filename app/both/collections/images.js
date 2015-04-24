var imageStore = new FS.Store.FileSystem('images', {
	path: Meteor.settings.public.defaultFileStoragePath
});

var imageThumbStore = new FS.Store.FileSystem('thumbs', {
	path: Meteor.settings.public.defaultFileStoragePath + 'thumbs/',
	transformWrite: function(file, readStream, writeStream) {
		if (file.cropData) {
			gm(readStream, file.name)
				//autoOrient().
				//gravity('Center')
				//resize(Meteor.settings.public.thumbnailImageWidth, Meteor.settings.public.thumbnailImageHeight, '^')
				.crop(file.cropData.width, file.cropData.height, file.cropData.x, file.cropData.y)
				.quality(Meteor.settings.public.thumbnailImageQuality)
				.stream()
				.pipe(writeStream);
		} else {
			gm(readStream, file.name)
				.autoOrient()
				.gravity('Center')
				.resize(Meteor.settings.public.thumbnailImageWidth, Meteor.settings.public.thumbnailImageHeight, '^')
				.quality(Meteor.settings.public.thumbnailImageQuality)
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
		maxsize: Meteor.settings.public.uploadMaxLimitSize,
		allow: {
			contentTypes: ['image/*'],
			extensions: Meteor.settings.public.uploadLimitExtensions.images
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
