Meteor.methods({
	createRecipe: function(recipe) {
		check(recipe, {
			title: String,
			description: String,
			image: String,
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
				image: String,
			}]),
			highlighted: Boolean,
			bookmarkedCount: Number
		});

		recipe.writer = {
			userId: Meteor.userId(),
			userName: App.helpers.getUserName(),
			userAvatar: App.helpers.getUserAvatar()
		};

		recipe.createdAt = new Date();

		var id = Recipes.insert(recipe);

		return id;
	}
});