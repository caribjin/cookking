App = {
	settings: {
		// 최대 재료 추가가능 개수 (필수재료/선택재료 각각)
		ingredientsCountLimit: 20,
		directionsCountLimit: 20
	},

	helpers: {
		getUserAvatar: function() {
			var user = Meteor.user();
			return (user && user.services.twitter && user.services.twitter.profile_image_url_https) || '';
		},

		getUserName: function() {
			var user = Meteor.user();
			return (user && user.profile && user.profile.name) || '';
		}
	}
};
