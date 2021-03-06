var wp = null;

Template.Recipes.incrementReadLimit = function() {
	Template.Recipes.setMoreButtonDisplay('loading');

	var result = Session.get(App.sessions.recipesLimit) + Meteor.settings.public.recipesLimitIncrementCount;
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

	Session.set(App.sessions.recipesLimit, Meteor.settings.public.defaultRecipesListLimit);

	this.autorun(function() {
		if (self.data.ready()) {
			//if (wp === null) {
			//	Template.Recipes.initWaypoint();
			//} else {
				var currentCount = Template.Recipes.currentCount();
				var totalCount = Template.Recipes.totalCount();

				if (totalCount != 0 && currentCount > totalCount) {
					$('.btn-more').show();
				} else {
					$('.btn-more').hide();
				}

				//console.log('refresh waypoint');

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

Template.Recipes.helpers({
	isEmptyRecipe: function() {
		var count = Counts.get('recipesTotalCount');
		return this.ready() && count == 0;
	}
});

Template.RecipeItem.onRendered(function() {
	var img = this.find('.recipeImg');

	//imagesLoaded(img).on('done', function () {
		$(img).velocity('transition.slideDownIn', {duration: Meteor.settings.public.defaultAnimationDurationSlow});
	//});
})
;