var TWEETING_KEY = 'shareOverlayTweeting';
var IMAGE_KEY = 'shareOverlayAttachedImage';

Template.Share.generateFileInfo = function(type, imageData, cropData) {
	var file = new FS.File();

	file.name(type + '-image-' + Meteor.uuid());
	file.attachData(imageData);
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
	file.category = type;

	return file;
};

/**
 * 촬영화면을 종료해야할 조건인지를 체크한다.
 * 레시피 완료 이미지 작성을 위한 촬영이였다면 편집이 없으므로 바로 촬영화면을 종료한다.
 * 기본적으로 촬영화면 종료 시 촬영된 이미지정보를 파기하지만, 이 경우 호출자(레시피 작성화면)에서
 * 이미지 정보를 사용해야 하므로 바로 파기 하지 않고, 사용 후 파기시킨다.
 * Feed 작성용 촬영이였다면, 편집을 거쳐야 하므로 바로 종료하지 않는다.
 * @param purpose   현재 오버레이창을 닫아야 하는지 여부. true: 닫는다. false: 닫지 않는다.
 */
Template.Share.skipEditImage = function(purpose) {
	var result = false;

	if (purpose === 'recipe' || purpose === 'direction') result = true;

	return result;
};

Template.Share.onCreated(function() {
	Session.set(TWEETING_KEY, true);
	Session.set(IMAGE_KEY, null);
});

Template.Share.helpers({
	attachedImage: function() {
		if (Session.get(IMAGE_KEY) && !Template.Share.skipEditImage(this.purpose)) {
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

		return !Template.Share.skipEditImage(this.purpose) ? Session.get(IMAGE_KEY) : null;
	},

	avatarImage: function() {
		return App.helpers.getCurrentUserAvatar() || App.settings.emptyAvatarImage;
	},

	tweeting: function() {
		return Session.get(TWEETING_KEY);
	}
});

Template.Share.events({
	'click .js-attach-from-album': function(e, tmpl) {
		var purpose = this.purpose;
		if (Meteor.isCordova) {
			App.helpers.getPicture('album', function (error, data) {
				if (!error) {
					Session.set(IMAGE_KEY, data);
					if (Template.Share.skipEditImage(purpose)) Overlay.close();
				}
			});
		} else {
			$('#imageFile').click();
		}
	},

	'click .js-attach-from-camera': function() {
		var purpose = this.purpose;
		App.helpers.getPicture('camera', function(error, data) {
			if (!error) {
				Session.set(IMAGE_KEY, data);
				if (Template.Share.skipEditImage(purpose)) Overlay.close();
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
		var self = this;

		// file => base64 변환
		var fileReader = new FileReader();
		fileReader.onload = function(e) {
			var dataUrl = this.result;
			Session.set(IMAGE_KEY, dataUrl);
			if (Template.Share.skipEditImage(self.purpose)) Overlay.close();
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

	'submit': function(e, tmpl) {
		e.preventDefault();

		var self = this;

		App.helpers.confirm('글 등록', '작성한 글을 올리시겠습니까?', 'info', true, function() {
			var text = $(e.target).find('[name=text]').val();
			var tweet = Session.get(TWEETING_KEY);
			var cropData = $('.cropper > img').cropper('getData');
			var file = Template.Share.generateFileInfo('feed', Session.get(IMAGE_KEY), cropData);

			if (!file) {
				App.helpers.error('인식할 수 없는 유형의 파일입니다');
				return;
			}

			Images.insert(file, function(error, file) {
				Session.set(IMAGE_KEY, null);

				if (error) {
					console.log(error.reason);
					return;
				}

				Meteor.call('createFeed', {
					recipeId: self._id,
					text: text,
					imageId: file._id
				}, tweet, Geolocation.currentLocation(), function(error, result) {
					if (error) {
						App.helpers.addNotification('ERROR: ' + error.reason, '확인', function() {});
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

Template.Share.onDestroyed(function() {
	// 레시피 완료사진 촬영일 경우는 촬영화면 종료시 이미지정보를 파기하지 않고, 호출화면에서 정보를 사용한 뒤 파기시킨다.
	if (!Template.Share.skipEditImage(this.data.purpose)) {
		Session.set(IMAGE_KEY, null);
	}
});
