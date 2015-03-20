Meteor.publish('user', function() {
	var currentUserId = this.userId;

	if (currentUserId) {
		return Meteor.users.find({_id: currentUserId}, {
			fields: {
				'services.facebook.email': 1,
				'services.github.email': 1,
				'services.google.email': 1,
				'services.google.picture': 1,
				'services.twitter.screenName': 1,
				'services.twitter.profile_image_url_https': 1,
				'emails.address[0]': 1,
				'profile': 1
			}
		});
	} else {
		return this.ready();
	}
});