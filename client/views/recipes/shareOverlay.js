var TWEETING_KEY = 'shareOverlayTweeting';
var IMAGE_KEY = 'shareOverlayAttachedImage';

Template.ShareOverlay.generateFileInfo = function() {
	var file = new FS.File();
	file.name('feed-image-' + Meteor.uuid());
	file.attachData(Session.get(IMAGE_KEY));

	var type = file.original.type;
	if (type.indexOf('/') && type.split('/').length > 1) {
		var arrType = type.split('/');
		if (arrType[0] === 'image') {
			var ext = arrType[arrType.length - 1];
			file.extension(ext);
		}
	} else {
		App.helpers.error('인식할 수 없는 유형의 파일입니다');
		return;
	}
	file.category = 'feed';

	return file;
};

Template.ShareOverlay.created = function() {
	Session.set(TWEETING_KEY, true);
	Session.set(IMAGE_KEY, null);
};

Template.ShareOverlay.helpers({
	attachedImage: function() {
		if (Session.get(IMAGE_KEY)) {
			setTimeout(function () {
				$('.cropper > img').cropper({
					aspectRatio: 1,
					autoCropArea: 0.80,
					strict: true,
					responsive: true,
					checkImageOrigin: true,
					modal: true,
					guides: false,
					highlight: true,
					background: false,
					autoCrop: true,
					dragCrop: false,
					movable: true,
					resizable: true,
					rotatable: true,
					mouseWheelZoom: false,
					touchDragZoom: false,
					minContainerWidth: 300,
					minContainerHeight: 400,
					minCropBoxWidth: 100,
					minCropBoxHeight: 100,
					crop: function(data) {
						//var str = 'x: ' + Math.round(data.x) +
						//		  'y: ' + Math.round(data.y) +
						//		  'width: ' + Math.round(data.width) +
						//		  'height: ' + Math.round(data.height) +
						//		  'rotate: ' + Math.round(data.rotate);
						//App.helpers.addNotification(str, '확인', function() {});
					},
					built: function() {
						$('div.cropper-canvas > .cropper-container > .cropper-drag-box').remove();
						$('div.cropper-canvas > .cropper-container > .cropper-crop-box').remove();
					}
				});
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

	//uploadedImages: function() {
	//	return Images.find();
	//}
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
		var self = this;

		event.preventDefault();

		var text = $(event.target).find('[name=text]').val();
		var tweet = Session.get(TWEETING_KEY);

		var file = Template.ShareOverlay.generateFileInfo();

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
					App.helpers.error(error.reason);
				} else {
					App.helpers.addNotification('사진을 공유했습니다', '보기', function() {
						Router.go('recipe', {_id: self._id}, {query: {feedId: result}});
						Template.Recipe.setTab('feed');
					});
				}
			});

			Overlay.close();
		});
	}
});

Template.ShareOverlay.destroyed = function() {
	Session.set(IMAGE_KEY, null);
};
