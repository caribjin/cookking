Template.Feed.onRendered(function() {
	var self = this;

	// If the activity is in a list, scroll it into view. Note, we can't just use
	// element.scrollIntoView() because it attempts to scroll in the X direction
	// messing up our animations
	if (Router.current().params.feedId === self.data._id) {
		var $activity = $(self.firstNode);
		var top = $activity.offset().top;
		var $parent = $(self.firstNode).closest('.content-scrollable');
		var parentTop = $parent.offset().top;
		$parent.scrollTop(top - parentTop);
	}
});

Template.Feed.helpers({
	firstName: function() {
		return this.writer.name;
	},

	userAvatar: function() {
		return this.writer.avatar || App.settings.emptyAvatarImage;
	},

	//recipeTitle: function() {
	//	Meteor.subscribe('recipe', this.recipeId);
	//	var recipe = Recipes.findOne(this.recipeId);
	//	return recipe ? recipe.title : 'unknown title';
	//},

	path: function() {
		return Router.path('recipe', {_id: this.recipeId}, {query: {feedId: this._id}});
	},

	image: function(id) {
		return new FS.File(FeedsImages.findOne(id));
	}
});
