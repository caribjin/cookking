App = {
	settings: {
		// 최대 재료 추가가능 개수 (필수재료/선택재료 각각)
		ingredientsCountLimit: 20,
		directionsCountLimit: 20,

		// 빈 아바타 이미지
		emptyAvatarImage: '/img/profile/profile-empty.png',

		// 사진촬영 이미지 기본 사이즈
		defaultCameraImageWidth: 640,
		defaultCameraImageHeight: 160,
		defaultCameraImageQuality: 75,

		// 기본 저장소 경로
		defaultFileStoragePath: '~/app-files/',

		// 피드 썸네일 이미지 크기
		thumbnailImageWidth: 180,
		thumbnailImageHeight: 180,

		// 업로드 최대 제한 용량
		uploadMaxLimitSize: 10485760,

		uploadLimitExtensions: {
			images: ['jpg', 'jpeg', 'png', 'gif']
		}
	},

	helpers: {
		getCurrentUserAvatar: function() {
			var user = Meteor.user();
			return (user && user.services.twitter && user.services.twitter.profile_image_url_https) || '';
		},

		getCurrentUserName: function() {
			var user = Meteor.user();
			return (user && user.profile && user.profile.name) || '';
		}
	}
};