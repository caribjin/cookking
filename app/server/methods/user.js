Meteor.methods({
	updateUser: function(user) {
		check(user, {
			id: String,
			profile: {
				name: String,
				introduction: String,
				avatar: Match.Optional(String)
			}
		});

		Meteor.users.upsert({
			_id: user.id
		}, {
			$set: {
				'profile.name': user.profile.name,
				'profile.introduction': user.profile.introduction
			}
		}, function(error, result) {
			if (error)
				throw new Meteor.Error(500, error.reason);

			return result.numberAffected;
		});
	}
});