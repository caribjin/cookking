Meteor.methods({
	'bookmarkRecipe': function(recipeId) {
		check(recipeId, String);

		Bookmarks.upsert({
			userId: Meteor.userId()
		}, {
			$addToSet: {
				recipeIds: recipeId
			}
		});

		Recipes.update({
			_id: recipeId
		}, {
			$inc: {
				bookmarkedCount: 1
			}
		});
	},

	'unbookmarkRecipe': function(recipeId) {
		check(recipeId, String);

		Bookmarks.update({
			userId: Meteor.userId(),
			recipeIds: recipeId
		}, {
			$pull: {
				recipeIds: recipeId
			}
		});

		Recipes.update({
			_id: recipeId
		}, {
			$inc: {
				bookmarkedCount: -1
			}
		});
	}
});