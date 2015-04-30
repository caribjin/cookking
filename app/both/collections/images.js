var imageStore = null;
var imageThumbStore = null;

var storeType = Meteor.settings.public.defaultStoreType;

if (Meteor.isClient) {
	if (storeType === 'filesystem') {
		imageStore = new FS.Store.FileSystem('images');
		imageThumbStore = new FS.Store.FileSystem('thumbs');
	} else if (storeType === 's3') {
		imageStore = new FS.Store.S3('images');
		imageThumbStore = new FS.Store.S3('thumbs');
	}
} else if (Meteor.isServer) {
	var transformWrite = function (file, readStream, writeStream) {
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
	};

	if (storeType === 'filesystem') {
		FS.TempStore.Storage = new FS.Store.FileSystem('_tempstore', {
			internal: true,
			path: Meteor.settings.app.defaultFileStoragePath + 'temp/'
		});

		imageStore = new FS.Store.FileSystem('images', {
			path: Meteor.settings.app.defaultFileStoragePath
		});

		imageThumbStore = new FS.Store.FileSystem('thumbs', {
			path: Meteor.settings.app.defaultFileStoragePath + 'thumbs/',
			transformWrite: transformWrite
		});
	} else if (storeType === 's3') {
		FS.TempStore.Storage = new FS.Store.FileSystem('_tempstore', {
			internal: true,
			path: Meteor.settings.app.defaultFileStoragePath + 'temp/'
		});

		imageStore = new FS.Store.S3('images', {
			bucket: 'cookking',
			accessKeyId: Meteor.settings.s3.accessKeyId,
			secretAccessKey: Meteor.settings.s3.secretAccessKey,
			maxTries: 2
		});

		imageThumbStore = new FS.Store.S3('thumbs', {
			bucket: 'cookking',
			accessKeyId: Meteor.settings.s3.accessKeyId,
			secretAccessKey: Meteor.settings.s3.secretAccessKey,
			folder: '/thumbs',
			maxTries: 2,
			transformWrite: transformWrite
		});
	}
}

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
