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

var DIMENSIONS = {
	small: '320x350',
	large: '640x480',
	full: '640x800'
};

var CATEGORIES = {
	'category-0': '반찬/샐러드',
	'category-1': '메인요리',
	'category-2': '국/찌개/탕/전골',
	'category-3': '면/죽/스프',
	'category-4': '빵/떡/과자/음료',
	'category-5': '소스/양념장/육수',
	'category-99': '기타'
};

_.extend(App, {
});

_.extend(App.helpers, {
	recipeImage: function(options) {
		var size = options.hash.size || 'large';

		if (options.hash.recipe)
			return '/img/recipes/' + DIMENSIONS[size] + '/' + options.hash.recipe.image;
	},

	isChecked: function(selector) {
		return $(selector) && $(selector).is(':checked');
	},

	getCheckedValue: function(groupName) {
		return $('[name=' + groupName + ']:checked').val();
	},

	drawRadiobox: function(value, text, name, checked, options) {
		if (!value) return;

		var tag = _.sprintf('<input type="radio" id="checkbox-3-%s" name="%s" value="%s" %s />', value, name, value, checked ? 'checked' : '');
		tag += _.sprintf('<label for="checkbox-3-%s"></label><label for="checkbox-3-%s">%s</label>', value, value, text);

		return tag;
	},

	/**
	 * 경고창을 출력한다
	 * @param title     제목
	 * @param text      내용
	 * @param type      아이콘유형. error | info | warning | success
	 * @param close     확인버튼 클릭 시 창 닫음 여부. 콜백함수에서 alert이나 confirm이 또다시 호출될 경우
	 *                  외부에서는 false, callback 내부에서는 true로 지정할 것.
	 * @param callback  callback 함수
	 */
	alert: function(title, text, type, close, callback) {
		if (!title) return;

		text = text || '';
		type = type || '';
		close = typeof close === 'undefined' ? true : close;

		//if (callback !== 'undefined' && typeof callback !== 'function') callback = new Function();
		if (!_.isFunction(callback)) callback = new Function();

		sweetAlert({
			title: title,
			text: text,
			type: type,
			showCancelButton: false,
			confirmButtonColor: '#6699cc',
			allowOutsideClick: false,
			confirmButtonText: '확인',
			closeOnConfirm: close,
			html: false
		}, callback);
	},

	error: function(text, callback) {
		if (!text) return;

		//if (callback !== 'undefined' && typeof callback !== 'function') callback = new Function();
		if (!_.isFunction(callback)) callback = new Function();

		sweetAlert({
			title: 'ERROR',
			text: text,
			type: 'error',
			showCancelButton: false,
			confirmButtonColor: '#DD4B39',
			allowOutsideClick: false,
			confirmButtonText: '확인',
			closeOnconfirm: true,
			html: true
		}, callback);
	},

	/**
	 * 확인창을 출력한다.
	 * @param title     제목
	 * @param text      내용
	 * @param type      아이콘유형. error | info | warning | success
	 * @param close     확인버튼 클릭 시 창 닫음 여부. 콜백함수에서 alert이나 confirm이 또다시 호출될 경우
	 *                  외부에서는 false, callback 내부에서는 true로 지정할 것.
	 * @param callback  callback 함수
	 */
	confirm: function(title, text, type, close, callback) {
		if (!title) return;

		text = text || '';
		type = type || '';
		close = typeof close === 'undefined' ? true : close;

		//if (callback !== 'undefined' && typeof callback !== 'function') callback = new Function();
		if (!_.isFunction(callback)) callback = new Function();

		sweetAlert({
			title: title,
			text: text,
			type: type,
			showCancelButton: true,
			confirmButtonColor: "#DD4B39",
			confirmButtonText: "네",
			cancelButtonText: '아니오',
			closeOnConfirm: close,
			html: false
		}, callback);
	},

	addNotification: function(title, actionText, callback) {
		Template.MasterLayout.addNotification({
			action: actionText,
			title: title,
			callback: callback
		});
	},

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
	},

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

_.each(App.helpers, function (helper, key) {
	Handlebars.registerHelper(key, helper);
});

Tracker.autorun(function() {
	var path = Iron.Location.get().path;
	App.helpers.track('Page Views');
});

Meteor.startup(function() {
	_.map(CATEGORIES, function(num, key) {
		Categories.insert({key: key, value: CATEGORIES[key]});
	});
});
