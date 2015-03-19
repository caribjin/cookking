var TWEETING_KEY = 'shareOverlayTweeting';
var IMAGE_KEY = 'shareOverlayAttachedImage';

Template.ShareOverlay.generateFileInfo = function(cropData) {
	var file = new FS.File();
	file.name('feed-image-' + Meteor.uuid());
	file.attachData(Session.get(IMAGE_KEY));
	file.cropData = cropData;

	var type = file.original.type;
	if (type.indexOf('/') && type.split('/').length > 1) {
		var arrType = type.split('/');
		if (arrType[0] === 'image') {
			var ext = arrType[arrType.length - 1];
			file.extension(ext);
		}
	} else {
		return null;
	}
	file.category = 'feed';

	return file;
};

Template.ShareOverlay.onCreated(function() {
	Session.set(TWEETING_KEY, true);
	Session.set(IMAGE_KEY, null);
});

Template.ShareOverlay.helpers({
	attachedImage: function() {
		if (Session.get(IMAGE_KEY)) {
			setTimeout(function () {
				var option = {
					crop: function(data) {
						var str = 'x: ' + Math.round(data.x) +
							' / y: ' + Math.round(data.y) +
							' / w: ' + Math.round(data.width) +
							' / h: ' + Math.round(data.height) +
							' / rot: ' + Math.round(data.rotate);

						$('.wrapper-checkbox > .checkbox > span').text(str);

						//if (Math.round(data.y) <= 0) e.defaultPrevent();
					},
					built: function() {
						$('div.cropper-container > .cropper-canvas > .cropper-container').remove();
						$('div.cropper-container > .cropper-canvas > img').attr('class', '');
					},
					dragmove: function(e) {
						if (e.dragType === 'move') e.preventDefault();

						//var cropboxData = $(this).cropper('getData'),
						//	imageData = $(this).cropper('getImageData');
						//
						//console.log(e.dragType);
						//console.log(JSON.stringify(cropboxData));
						//console.log(JSON.stringify(imageData));
						//
						//if (e.dragType === 'all') {
						//	var x = cropboxData.x,
						//		y = cropboxData.y,
						//		w = cropboxData.width,
						//		h = cropboxData.height,
						//		imageWidth = imageData.naturalWidth,
						//		imageHeight = imageData.naturalHeight,
						//		imageRatio = imageData.aspectRatio,
						//		imageRotate = imageData.rotate;
						//
						//	if (x < 0 || y < 0 || x + w > imageWidth || y + h > imageHeight) e.preventDefault();
						//}
					}
				};
				App.helpers.cropper('.cropper > img', option);
			}, 0);
		}

		return Session.get(IMAGE_KEY);
	},

	avatarImage: function() {
		return App.helpers.getCurrentUserAvatar() || App.settings.emptyAvatarImage;
	},

	tweeting: function() {
		return Session.get(TWEETING_KEY);
	}
});

Template.ShareOverlay.events({
	'click .js-attach-from-album': function(e, tmpl) {
		if (Meteor.isCordova) {
			App.helpers.getPicture('album', function (error, data) {
				if (!error) {
					Session.set(IMAGE_KEY, data);
				}
			});
		} else {
			$('#imageFile').click();
		}
	},

	'click .js-attach-from-camera': function() {
		App.helpers.getPicture('camera', function(error, data) {
			if (!error) {
				Session.set(IMAGE_KEY, data);
			}
		})
	},

	'click .js-unattach-image': function() {
		Session.set(IMAGE_KEY, null);
	},

	'change [name=tweeting]': function(event) {
		Session.set(TWEETING_KEY, $(event.target).is(':checked'));
	},

	'change .imageFile': function(e, tmpl) {
		var files = event.target.files;

		if (files.length === 0) return;
		var file = files[0];

		// file => base64 변환
		var fileReader = new FileReader();
		fileReader.onload = function(e) {
			var dataUrl = this.result;
			Session.set(IMAGE_KEY, dataUrl);
		};
		fileReader.readAsDataURL(file);

		// file => arraybuffer 변환
		//var fileReader = new FileReader();
		//fileReader.onload = function(e) {
		//	var buffer = new Uint8Array(this.result);
		//	Meteor.call('test', buffer);
		//};
		//fileReader.readAsArrayBuffer(file);
	},

	'submit': function(event, template) {
		event.preventDefault();

		var self = this;

		App.helpers.confirm('글 등록', '작성한 글을 올리시겠습니까?', 'info', true, function() {
			var text = $(event.target).find('[name=text]').val();
			var tweet = Session.get(TWEETING_KEY);
			var cropData = $('.cropper > img').cropper('getData');
			var file = Template.ShareOverlay.generateFileInfo(cropData);

			if (!file) {
				App.helpers.error('인식할 수 없는 유형의 파일입니다');
				return;
			}

			Images.insert(file, function(error, file) {
				if (error) {
					console.log(error.reason);
				}

				Session.set(IMAGE_KEY, null);

				Meteor.call('createFeed', {
					recipeId: self._id,
					text: text,
					imageId: file._id
				}, tweet, Geolocation.currentLocation(), function(error, result) {
					if (error) {
						App.helpers.addNotification('오류: ' + error.reason);
					} else {
						App.helpers.addNotification('사진을 공유했습니다', '보기', function() {
							Router.go('recipe', {_id: self._id}, {query: {feedId: result}});
							Template.Recipe.setTab('feed');
						});
					}
				});

				Overlay.close();
			});

		});
	}
});

Template.ShareOverlay.onDestroyed(function() {
	Session.set(IMAGE_KEY, null);
});
