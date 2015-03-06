var TAB_KEY = 'recipeShowTab';

Template.Recipe.created = function() {
	if (Router.current().params.feedId)
		Template.Recipe.setTab('feeds');
	else
		Template.Recipe.setTab('recipe');
};

Template.Recipe.rendered = function () {
	this.$('.recipe').touchwipe({
		wipeDown: function () {
			if (Session.equals(TAB_KEY, 'recipe'))
				Template.Recipe.setTab('ingredients')
		},
		preventDefaultEvents: false
	});
	this.$('.recipe-information').touchwipe({
		wipeUp: function () {
			if (!Session.equals(TAB_KEY, 'recipe'))
				Template.Recipe.setTab('recipe')
		},
		preventDefaultEvents: false
	});
};

// CSS transitions can't tell the difference between e.g. reaching
//   the "make" tab from the expanded state or the "feeds" tab
//   so we need to help the transition out by attaching another
//   class that indicates if the feeds tab should slide out of the
//   way smoothly, right away, or after the transition is over
Template.Recipe.setTab = function(tab) {
	var lastTab = Session.get(TAB_KEY);
	Session.set(TAB_KEY, tab);

	// 패널이 위로 올라갈 때
	var fromRecipe = (lastTab === 'recipe') && (tab !== 'recipe');
	$('.ingredient-scrollable').toggleClass('instant', fromRecipe);
	$('.direction-scrollable').toggleClass('instant', fromRecipe);
	$('.feed-scrollable').toggleClass('instant', fromRecipe);

	// 패널이 밑으로 내려갈 떄
	var toRecipe = (lastTab !== 'recipe') && (tab === 'recipe');
	$('.ingredient-scrollable').toggleClass('delayed', toRecipe);
	$('.direction-scrollable').toggleClass('delayed', toRecipe);
	$('.feed-scrollable').toggleClass('delayed', toRecipe);
};

Template.Recipe.helpers({
	isActiveTab: function(name) {
		return Session.equals(TAB_KEY, name);
	},

	activeTabClass: function() {
		return Session.get(TAB_KEY);
	},

	bookmarked: function() {
		var exist = Meteor.user() && Bookmarks.find({'recipeIds': this._id}).count() > 0;
		return exist;
	},

	feeds: function() {
		return Feeds.find({recipeId: this._id}, {sort: {createdAt: -1}});
	},

	favoritesCount: function() {
		return Math.round(Math.random() * 1000);
	},

	commentsCount: function() {
		return Math.round(Math.random() * 100);
	},

	sharedCount: function() {
		return Math.round(Math.random() * 200);
	}
});

Template.Recipe.events({
	'click .js-add-bookmark': function(event) {
		event.preventDefault();

		if (!Meteor.userId())
			return Overlay.open('authOverlay');

		Meteor.call('bookmarkRecipe', this._id);
	},

	'click .js-remove-bookmark': function(event) {
		event.preventDefault();

		Meteor.call('unbookmarkRecipe', this._id);
	},

	'click .js-share': function() {
		Overlay.open('ShareOverlay', this);
	},

	'click .js-show-ingredients': function(event) {
		event.stopPropagation();
		Template.Recipe.setTab('ingredients');
	},

	'click .js-show-directions': function(event) {
		event.stopPropagation();
		Template.Recipe.setTab('directions')
	},

	'click .js-show-feeds': function(event) {
		event.stopPropagation();
		Template.Recipe.setTab('feeds')
	},

	'click .js-recipe': function() {
		Template.Recipe.setTab('recipe')
	}
});

