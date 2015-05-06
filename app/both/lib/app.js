sm = new SubsManager();

App = {
	sessions: {
		ignoreConnectionIssue:      'ignoreConnectionIssue',        // 연결문제 무시 시간
		menuOpen:                   'menuOpen',                     // 메뉴 열림 상태
		overlayTemplateName:        'overlayTemplateName',          // 현재의 오버레이 템플릿명
		overlayTemplateData:        'overlayTemplateData',          // 현재의 오버레이 템플릿 데이터
		recipesLimit:               'recipesLimit',                 // 레시피목록 현재 가져오는 개수
		recipesCurrentSort:         'recipesCurrentSort',           // 레시피목록 현재 정렬키
		recipesCurrentFilter:       'recipesCurrentFilter',         // 레시피목록 현재 필터키
		shareImageData:             'shareImageData',               // 공유 이미지 데이터
		shareImagePurpose:          'shareImagePurpose'             // 공유 이미지 사용목적 (share/recipe/direction)
	},

	helpers: {
		/**
		 * 현재 사용자의 프로필 이미지 경로를 얻는다.
		 * @param size          undefined/normal : 작은 이미지, large: 큰 이미지
		 * @returns {string}    프로필 이미지 url
		 */
		getCurrentUserAvatar: function(size) {
			var user = Meteor.user();
			var result = '';

			if (user) {
				result = user.profile.avatar;

				if (size === 'large') {
					result = result.replace(/-_normal/gi, '-_400x400');
				}
			} else {
				throw new Error('logged-out', 'User not loged in');
			}

			return result;
		},

		getCurrentUserName: function() {
			var user = Meteor.user();
			var result = '';

			if (user) {
				result = (user.profile && user.profile.name) || '';
			} else {
				throw new Meteor.Error('logged-out', 'User not loged in');
			}

			return result;
		},

		isAdmin: function() {
			var role = '';
			if (Meteor.user() && Meteor.user().profile) {
				role = Meteor.user().profile.role;
			}

			return role === 'admin';
		},

		getLoginServiceType: function() {
			var user = Meteor.user();
			var result = '';

			if (user) {
				var services = user.services;

				if (services.twitter) {
					result = 'twitter';
				} else if (services.password) {
					result = 'password';
				} else if (services.facebook) {
					result = 'facebook';
				} else if (services.google) {
					result = 'google';
				}
			} else {
				throw new Meteor.Error('logged-out', 'User not loged in');
			}

			return result;
		},

		randomDate: function(start, end) {
			var s, e;

			if (start) s = start;
			else s = new Date(2000, 1, 1);

			if (end) e = end;
			else e = new Date();

			return new Date(s.getTime() + Math.random() * (e.getTime() - s.getTime()));
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
				var dayDiff = moment().diff(moment(datetime), 'days');

				if (dayDiff > Meteor.settings.public.shortDateDisplayDiff) {
					return moment(datetime).format('YYYY/MM/DD hh:mm');
				} else {
					return moment(datetime).fromNow();
				}
			} else {
				return datetime;
			}
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

		validateFormatEmail: function(str) {
			var pattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
			return pattern.test(str);
		},

		shorten: function(str, len) {
			if (str && len) {
				if (str.length > len && Session.get('shorten')) {
					str = str.substring(0,len) + "...";
				}
			}
			return str;
		},

		pad: function(number, digits) {
			return String("00000000" + number).slice(-(digits+1));
		},

		camel: function(str) {
			return str.replace(/(?:^|\s)\w/g, function(match) {
				return match.toUpperCase();
			});
		},

		checkRole: function(userId, rolename) {
			var authorized = false;
			if (Roles.userIsInRole(userId, [rolename]) || Roles.userIsInRole(userId,['admin'])) {
				authorized = true;
			}
			return authorized;
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
		}
	}
};
