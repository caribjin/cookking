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
			filter: String,
			ingredients: {
				must: Match.Optional([String]),
				option: Match.Optional([String])
			},
			directions: Match.Optional([{
				text: String,
				imageData: String
			}]),
			highlighted: Boolean,
			bookmarkedCount: Number
		});

		recipe.writer = {
			id: Meteor.userId(),
			name: App.helpers.getCurrentUserName(),
			avatar: App.helpers.getCurrentUserAvatar()
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
	},

	bookmarkRecipe: function(recipeId) {
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

	unbookmarkRecipe: function(recipeId) {
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
	},

	favoriteRecipe: function(recipeId) {
		check(recipeId, String);

		Favorites.upsert({
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
				favoritesCount: 1
			}
		});

		var result = Recipes.findOne(recipeId);

		if (result) result = result.favoritesCount;
		else result = 0;

		return result;
	}
});