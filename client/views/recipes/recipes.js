var wp = null;

Template.Recipes.incrementReadLimit = function() {
	Template.Recipes.setMoreButtonDisplay('loading');

	var result = Session.get(App.sessions.recipesLimit) + App.settings.recipesLimitIncrementCount;
	if (result >= this.totalCount()) result = this.totalCount();

	return Session.set(App.sessions.recipesLimit, result);
};

Template.Recipes.currentReadLimit = function() {
	return Session.get(App.sessions.recipesLimit);
};

Template.Recipes.setMoreButtonDisplay = function(status) {
	var $moreButton = $('.btn-more');

	if (status == 'done') {
		$moreButton.removeClass('loading');
	} else if (status == 'loading') {
		$moreButton.addClass('loading');
	}

	//if ($moreButton.hasClass('loading')) $moreButton.removeClass('loading');
	//else $moreButton.addClass('loading');
};

Template.Recipes.initWaypoint = function() {
	wp = $('.btn-more').waypoint(function(direction) {
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

Template.Recipes.totalCount = function() {
	return Counts.get('recipesTotalCount');
};

Template.Recipes.currentCount = function() {
	var data = Template.instance().data;
	return Recipes.find(data.condition(), data.option()).count();
};

Template.Recipes.onCreated(function() {
	wp = null;
	var self = this;

	Session.set(App.sessions.recipesLimit, App.settings.defaultRecipesListLimit);

	this.autorun(function() {
		if (self.data.ready()) {
			//if (wp === null) {
			//	Template.Recipes.initWaypoint();
			//} else {
				var currentCount = Template.Recipes.currentCount();
				var totalCount = Template.Recipes.totalCount();

				//console.log(currentCount + ' / ' + totalCount);

				if (currentCount >= totalCount) {
					$('.btn-more').hide();
				} else {
					$('.btn-more').show();
				}

				console.log('refresh waypoint');

				//$.waypoints('refresh');
				Template.Recipes.setMoreButtonDisplay('done');
			//}
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
})
;