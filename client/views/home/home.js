Template.Home.helpers({
	lastRecipes: function() {
		var recipes = this.lastRecipes().fetch();
		var selection = [];

		for (var i=0; i<4; i++)
			selection.push(recipes.splice(_.random(recipes.length - 1), 1)[0]);

		return selection;
	},

	lastFeeds: function() {
		return this.lastFeeds();
	},

	lastNews: function() {
		return this.lastNews();
	}
});
