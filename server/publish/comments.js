Meteor.publish('comments', function(recipeId, options) {
	check(recipeId, String);
	check(options, {
		sort: {
			createdAt: Number
		},
		limit: Number
	});

	return Comments.find({recipeId: recipeId, deleted: {$exists: false}}, options);
});