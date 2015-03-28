var RECIPES_LIMIT = 'recipesLimitCount';
var RECIPES_SUB_COMPLETED = 'recipesSubCompleted';
var waypoint = null;
var recipesBeforeCount;

Template.Recipes.incrementReadLimit = function() {
	Template.Recipes.toggleMoreButtonDisplay();
	recipesBeforeCount = Recipes.find().count();

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
		if (Session.get(RECIPES_SUB_COMPLETED)) {
			if (waypoint === null) {
				Template.Recipes.initWaypoint();
			} else {
				$.waypoints('refresh');
				Template.Recipes.toggleMoreButtonDisplay();

				var recipesAfterCount = Recipes.find().count();
				if (recipesBeforeCount < recipesAfterCount) recipesBeforeCount = recipesAfterCount;
				else $('.btn-more').hide();
			}

			Session.set(RECIPES_SUB_COMPLETED, false);
		}
	});
});

Template.Recipes.events({
	'click .js-get-more': function(e, tmpl) {
		Template.Recipes.incrementReadLimit();
	}
});