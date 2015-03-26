var RECIPES_LIMIT = 'recipesLimitCount';
var SUBSCRIPTION_COMPLETED = 'subscriptionCompleted';
var waypoint = null;

Template.Recipes.incrementReadLimit = function() {
	return Session.set(RECIPES_LIMIT, Session.get(RECIPES_LIMIT) + App.settings.recipesLimitIncrementCount);
};

Template.Recipes.currentReadLimit = function() {
	return Session.get(RECIPES_LIMIT);
};

Template.Recipes.initWaypoint = function() {
	//waypoint = new Waypoint({
	//	element: $('.btn-more'),
	//	context: $('.content-scrollable'),
	//	offset: 'bottom-in-view',
	//	handler: function (direction) {
	//		if (direction === 'down') {
	//			console.log('[[[[[ load more ]]]]]');
	//			Template.Recipes.incrementReadLimit();
	//		}
	//	}
	//});
	waypoint = $('.btn-more').waypoint(function(direction) {
		if (direction === 'down') {
			console.log('[[[[[ load more ]]]]]');
			Template.Recipes.incrementReadLimit();
		}
	}, {
		context: $('.content-scrollable'),
		offset: 'bottom-in-view'
	});
	console.log('~~~~~~~~~ waypoint init ~~~~~~~~~');
};

Template.Recipes.onCreated(function() {
	Session.set(RECIPES_LIMIT, App.settings.defaultRecipesListLimit);

	//console.log('onCreated');

	var self = this;
	waypoint = null;

	this.autorun(function() {
		var ready = self.data.ready();

		//console.log('autorun ready - ' + ready);

		if (ready) {
			Template.Recipes.initWaypoint();
		}
	});

	this.autorun(function() {
		if (Session.get(SUBSCRIPTION_COMPLETED)) {
			//console.log('test: ' + Session.get(SUBSCRIPTION_COMPLETED));
			//console.log('refreshAll - waypoint is ' + waypoint);

			if (waypoint === null) {
				Template.Recipes.initWaypoint();
			} else {
				//Waypoint.refreshAll();
				$.waypoints('refresh');
			}

			Session.set(SUBSCRIPTION_COMPLETED, false);
		}

		//console.log(Template.Recipes.currentReadLimit());

		//var recipeCount = Recipes.find().count();
		//
		//if (recipeCount) {
		//	console.log('counting is changed: ' + recipeCount);
		//	Waypoint.refreshAll();
		//}
	});
});

Template.Recipes.onRendered(function() {
	//console.log('onRedered');

	//$(window).scroll(function() {
	//	if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
	//		Template.Recipes.incrementReadLimit();
	//	}
	//});


	//if (!this.rendered) {
	//	this.rendered = true;
	//}
	//
	//if (this.rendered) {
	//var self = this;
	//Meteor.setTimeout(function() {
	//	console.log('recipes rendered.');
	//
	//	new Waypoint({
	//		element: $('.btn-more'),
	//		context: $('.content-scrollable'),
	//		offset: 'bottom-in-view',
	//		handler: function (direction) {
	//			if (direction === 'down') {
	//				console.log('load more');
	//				Template.Recipes.incrementReadLimit();
	//			}
	//		}
	//	});
	//}, 1000);
	//}

	//setTimeout(function() {
	//	new Waypoint({
	//		element: $('.btn-more'),
	//		context: $('.content-scrollable'),
	//		offset: 'bottom-in-view',
	//		handler: function (direction) {
	//			if (direction === 'down') {
	//				console.log('load more');
	//				Template.Recipes.incrementReadLimit();
	//			}
	//		}
	//	});
	//}, 1000);
});

Template.Recipes.events({
	'click .js-get-more': function(e, tmpl) {
		Template.Recipes.incrementReadLimit();
	}
});