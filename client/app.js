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
	},

	formatDate: function(datetime) {
		if (moment && datetime){
			return moment(datetime).format('MM/DD/YYYY');
		} else {
			return datetime;
		}
	},

	formatDateTime: function(datetime) {
		if (moment && datetime) {
			if (datetime.getDate() === new Date().getDate()) {
				return "Today " + moment(datetime).format("hh:mm");
			} else {
				return moment(datetime).format("MM/DD/YYYY hh:mm");
			}
		} else {
			return datetime;
		}
	},

	shorten: function(str, len) {
		if (str && len) {
			if (str.length > len && Session.get('shorten')) {
				str = str.substring(0,len) + "...";
			}
		}
		return str;
	},

	checkRole: function(userId, rolename) {
		var authorized = false;
		if (Roles.userIsInRole(userId, [rolename]) || Roles.userIsInRole(userId,['admin'])) {
			authorized = true;
		}
		return authorized;
	},

	formatFileSize: function(str) {
		str = (Number(str)/1000000).toFixed(2) + "MB";
		return str;
	},

	formatPhone: function(str) {
		if (str && str.length > 9) {
			str = "(" + str.substring(0,3) + ")" + str.substring(3,6) + "-" + str.substring(6,13);
		}
		return str;
	},

	isAdmin: function() {
		if (Meteor.user() && Meteor.user().profile)
			var role = Meteor.user().profile.role;
		return role === 'admin';
	},

	pad: function(number, digits) {
		return String("00000000" + number).slice(-(digits+1));
	},

	camel: function(str) {
		return str.replace(/(?:^|\s)\w/g, function(match) {
			return match.toUpperCase();
		});
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
