/*****************************************************************************/
/* Client App Namespace  */
/*****************************************************************************/
var isUserAgentBlacklisted = function() {
	var blacklist = ['PhantomJS', 'Googlebot', 'Bing', 'Yahoo'];
	var userAgent = navigator.userAgent;

	if (!userAgent) return false;

	for (var i=0; i<blacklist.length; i++) {
		if (userAgent.indexOf(blacklist[i]) >= 0) {
			return true;
		}
	}

	return false;
};

_.extend(App, {
	track: function(key, meta) {
		meta = meta || {};

		if (isUserAgentBlacklisted()) return;

		//Meteor.autorun(function(c) {
		//	if (!Meteor.loggingIn()) {
		//		var user =  Tracker.nonreactive(function() { return Meteor.user(); });
		//		var email;
		//
		//		if (user && user.emails.length > 0) {
		//			email = user.emails[0].address;
		//		} else {
		//			email = 'anonymous';
		//		}
		//
		//		_.extend(meta, {
		//			email: email,
		//			path: location.pathname
		//		});
		//
		//		mixpanel.track(key, meta);
		//		c.stop();
		//	}
		//});
	}
});

var DIMENSIONS = {
	small: '320x350',
	large: '640x480',
	full: '640x800'
};

App.helpers = {
	pluralize: function(n, thing, options) {
		var plural = thing;
		if (_.isUndefined(n)) {
			return thing;
		} else if (n !== 1) {
			if (thing.slice(-1) === 's')
				plural = thing + 'es';
			else
				plural = thing + 's';
		}

		if (options && options.hash && options.hash.wordOnly)
			return plural;
		else
			return n + ' ' + plural;
	},

	activePage: function() {
		// includes Spacebars.kw but that's OK because the route name ain't that.
		var routeNames = arguments;

		return _.include(routeNames, Router.current().route.name) && 'active';
	}
};

_.each(App.helpers, function (helper, key) {
	Handlebars.registerHelper(key, helper);
});

UI.registerHelper('recipeImage', function(options) {
	var size = options.hash.size || 'large';

	if (options.hash.recipe)
		return '/img/recipes/' + DIMENSIONS[size] + '/' + options.hash.recipe.name + '.jpg';
});

Tracker.autorun(function() {
	var path = Iron.Location.get().path;
	App.track('Page Views');
});
