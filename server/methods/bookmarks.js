Meteor.methods({
	'bookmarkRecipe': function(recipeId) {
		var userEmail = Meteor.user().emails[0].address;

		check(userEmail, String);
		check(recipeId, String);

		var affected = Bookmarks.upsert({
			userEmail: userEmail
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
		var userEmail = Meteor.user().emails[0].address;

		check(userEmail, String);
		check(recipeId, String);

		var affected = Bookmarks.update({
			userEmail: userEmail,
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
})