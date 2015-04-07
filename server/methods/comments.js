Meteor.methods({
	createComment: function(comment) {
		check(comment, {
			recipeId: String,
			writer: {
				id: String,
				name: String,
				avatar: String
			},
			text: String
		});

		comment = _.extend(comment, {
			createdAt: new Date()
		});

		var id = Comments.insert(comment);

		Recipes.update({_id: comment.recipeId}, {$inc: {commentsCount: 1}});

		return id;
	},

	deleteComment: function(id, recipeId) {
		check(id, String);
		check(recipeId, String);

		Comments.remove(id);

		Recipes.update({_id: recipeId}, {$inc: {commentsCount: -1}});
	}
});