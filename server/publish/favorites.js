Meteor.publish('favorites', function(userId) {
	check(userId, String);

	return Favorites.find({userId: userId});
});