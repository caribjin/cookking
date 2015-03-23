Meteor.methods({
	createRecipe: function(recipe) {
		check(recipe, {
			title: String,
			description: String,
			imageId: String,
			public: Boolean,
			serving: Number,
			cookTime: Number,
			source: {
				name: String,
				url: String
			},
			ingredients: {
				must: Match.Optional([String]),
				option: Match.Optional([String])
			},
			directions: Match.Optional([{
				text: String,
				image: String
			}]),
			highlighted: Boolean,
			bookmarkedCount: Number
		});

		recipe.writer = {
			userId: Meteor.userId(),
			userName: App.helpers.getCurrentUserName(),
			userAvatar: App.helpers.getCurrentUserAvatar()
		};

		recipe.createdAt = new Date();

		var id = Recipes.insert(recipe);

		return id;
	},

	deleteRecipe: function(recipeId) {
		check(recipeId, String);

		var f = new Future();

		tx.start('delete recipe');
		tx.softDelete = true;

		Feeds.find({recipeId: recipeId}).forEach(function(feed) {
			Images.remove(feed.imageId, {tx: true});
			Feeds.remove({_id: feed._id}, {tx: true});
		});

		Recipes.remove({_id: recipeId}, {tx: true});

		tx.commit(function(error, result) {
			if (error) {
				f.throw(error);
			} else {
				f.return(result);
			}
		});

		return f.wait();
	}
});