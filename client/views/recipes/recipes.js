var RECIPES_LIMIT = 'recipesLimitCount';
var SUBSCRIPTION_COMPLETED = 'subscriptionCompleted';
var waypoint = null;

Template.Recipes.incrementReadLimit = function() {
	Template.Recipes.toggleMoreButtonDisplay();
	return Session.set(RECIPES_LIMIT, Session.get(RECIPES_LIMIT) + App.settings.recipesLimitIncrementCount);
};

Template.Recipes.currentReadLimit = function() {
	return Session.get(RECIPES_LIMIT);
};

Template.Recipes.toggleMoreButtonDisplay = function() {
	var $moreButton = $('.btn-more');

	if ($moreButton.hasClass('loading')) $moreButton.removeClass('loading');
	else $moreButton.addClass('loading');
};

Template.Recipes.initWaypoint = function() {
	waypoint = $('.btn-more').waypoint(function(direction) {
		if (direction === 'down') {
			console.log('[[[[[ load more ]]]]]');
			Template.Recipes.incrementReadLimit();
		}
	}, {
		context: $('.content-scrollable'),
		offset: 'bottom-in-view'
	});

	console.log('waypoint init');
};

Template.Recipes.onCreated(function() {
	Session.set(RECIPES_LIMIT, App.settings.defaultRecipesListLimit);

	var self = this;
	waypoint = null;

	this.autorun(function() {
		if (Session.get(SUBSCRIPTION_COMPLETED)) {
			if (waypoint === null) {
				Template.Recipes.initWaypoint();
			} else {
				$.waypoints('refresh');
				Template.Recipes.toggleMoreButtonDisplay();
			}

			Session.set(SUBSCRIPTION_COMPLETED, false);
		}
	});
});

Template.Recipes.events({
	'click .js-get-more': function(e, tmpl) {
		Template.Recipes.incrementReadLimit();
	}
});