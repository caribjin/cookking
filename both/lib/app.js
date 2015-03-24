App = {
	settings: {
		// 최대 재료 추가가능 개수 (필수재료/선택재료 각각)
		ingredientsCountLimit: 20,
		directionsCountLimit: 20,

		// 빈 아바타 이미지
		emptyAvatarImage: '/img/profile/profile-empty.png',

		// 기본 저장소 경로
		defaultFileStoragePath: '~/app-files/',

		// 사진촬영 이미지 기본 사이즈
		defaultCameraImageWidth: 1024,
		defaultCameraImageHeight: 1024,
		defaultCameraImageQuality: 90,

		// 피드 썸네일 이미지 크기
		thumbnailImageWidth: 320,
		thumbnailImageHeight: 320,
		thumbnailImageQuality: 80,

		// 업로드 최대 제한 용량
		uploadMaxLimitSize: 10485760,

		// 업로드 이미지 제한 확장자
		uploadLimitExtensions: {
			images: ['jpg', 'jpeg', 'png', 'gif']
		},

		// 기본 애니메이션 속도 (ms)
		defaultAnimationDuration: 200
	},

	helpers: {
		getCurrentUserAvatar: function() {
			var user = Meteor.user();
			var result = '';

			if (user) {
				var service = user.services;

				if (service.twitter) {
					result = service.twitter.profile_image_url_https;
				} else if (user.services.google) {
					result = service.google.picture;
				}
			}

			return result;
		},

		getCurrentUserName: function() {
			var user = Meteor.user();
			return (user && user.profile && user.profile.name) || '';
		},

		randomDate: function(start, end) {
			var s, e;

			if (start) s = start;
			else s = new Date(2000, 1, 1);

			if (end) e = end;
			else e = new Date();

			return new Date(s.getTime() + Math.random() * (e.getTime() - s.getTime()));
		},

		formatDate: function(datetime) {
			if (moment && datetime){
				return moment(datetime).format('MM/DD/YYYY');
			} else {
				return datetime;
			}
		},

		formatDateTime: function(datetime) {
			if (moment && datetime) {
				if (datetime.getDate() === new Date().getDate()) {
					return "Today " + moment(datetime).format("hh:mm");
				} else {
					return moment(datetime).format("MM/DD/YYYY hh:mm");
				}
			} else {
				return datetime;
			}
		},

		shorten: function(str, len) {
			if (str && len) {
				if (str.length > len && Session.get('shorten')) {
					str = str.substring(0,len) + "...";
				}
			}
			return str;
		},

		formatFileSize: function(str) {
			str = (Number(str)/1000000).toFixed(2) + "MB";
			return str;
		},

		formatPhone: function(str) {
			if (str && str.length > 9) {
				str = "(" + str.substring(0,3) + ")" + str.substring(3,6) + "-" + str.substring(6,13);
			}
			return str;
		},

		pad: function(number, digits) {
			return String("00000000" + number).slice(-(digits+1));
		},

		camel: function(str) {
			return str.replace(/(?:^|\s)\w/g, function(match) {
				return match.toUpperCase();
			});
		},

		isAdmin: function() {
			if (Meteor.user() && Meteor.user().profile)
				var role = Meteor.user().profile.role;
			return role === 'admin';
		},

		checkRole: function(userId, rolename) {
			var authorized = false;
			if (Roles.userIsInRole(userId, [rolename]) || Roles.userIsInRole(userId,['admin'])) {
				authorized = true;
			}
			return authorized;
		},

		pluralize: function(n, thing, options) {
			var plural = thing;
			if (_.isUndefined(n)) {
				return thing;
			} else if (n !== 1) {
				if (thing.slice(-1) === 's')
					plural = thing + 'es';
				else
					plural = thing + 's';
			}

			if (options && options.hash && options.hash.wordOnly)
				return plural;
			else
				return n + ' ' + plural;
		}
	}
};
