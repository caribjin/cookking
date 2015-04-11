var waypoint = null;

Template.Recipes.incrementReadLimit = function() {
	Template.Recipes.toggleMoreButtonDisplay();

	return Session.set(App.sessions.recipesLimit, Session.get(App.sessions.recipesLimit) + App.settings.recipesLimitIncrementCount);
};

Template.Recipes.currentReadLimit = function() {
	return Session.get(App.sessions.recipesLimit);
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
	Session.set(App.sessions.recipesLimit, App.settings.defaultRecipesListLimit);

	var self = this;
	waypoint = null;

	this.autorun(function() {
		if (Session.get(App.sessions.recipesSubscribeComplate)) {
			if (waypoint === null) {
				Template.Recipes.initWaypoint();
			} else {
				var totalCount = TotalCount.findOne().count;
				var currentCount = Recipes.find().count();

				console.log(currentCount + ' / ' + totalCount);

				if (currentCount >= totalCount) {
					$('.btn-more').hide();
				} else {
					$('.btn-more').show();
				}

				console.log('refresh waypoint');

				$.waypoints('refresh');
				Template.Recipes.toggleMoreButtonDisplay();
			}

			Session.set(App.sessions.recipesSubscribeComplate, false);
		}
	});
});

Template.Recipes.events({
	'click .js-get-more': function(e, tmpl) {
		Template.Recipes.incrementReadLimit();
	}
});

Template.RecipeItem.onRendered(function() {
	var img = this.find('.recipeImg');

	//imagesLoaded(img).on('done', function () {
		$(img).velocity('transition.slideDownIn', {duration: App.settings.defaultAnimationDurationSlow});
	//});
});