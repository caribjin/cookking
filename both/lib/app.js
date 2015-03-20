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
		thumbnailImageQuality: 100,

		// 업로드 최대 제한 용량
		uploadMaxLimitSize: 10485760,

		// 업로드 이미지 제한 확장자
		uploadLimitExtensions: {
			images: ['jpg', 'jpeg', 'png', 'gif']
		}
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
		}
	}
};
