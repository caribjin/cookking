//if (typeof Meteor.settings === 'undefined') Meteor.settings = {};

Meteor.settings || {};

var settings = {
	mixpanel: {
		token: 'cadc3e7586000d54d39a1ca8b55a301a'
	},

	mailgun: {
		uri: 'https://api.mailgun.net/v2/address/validate',
		apikey: 'key-4864192e3f29095781f250ad422c5d44',
		pubkey: 'pubkey-ac58421a29124226f0966279878493cb'
	},

	authServices: {
		facebook: {
			service: 'facebook',
			appId: '746818698758705',
			secret: '0e7eb65f739fb0925b0e4c7b11fb249c'
		},
		twitter: {
			service: 'twitter',
			consumerKey: 'NFDQXe7P29etHwMGtJgbbEk8T',
			secret: '49InZjniVGm04A81A2XqlzJb4OcXjALfmzAArBsRXkzOn6FEXT'
		},
		github: {
			service: 'github',
			clientId: '6390dc994b1ff3778041',
			secret: '1230c34c84bbde2733e327a0094d2a3559dd7c0c'
		},
		google: {
			service: 'google',
			clientId: '107078223596-o154g6ur25lr6kc5gmjdghjsp48ooe7u.apps.googleusercontent.com',
			secret: 'eW_iLDBzYbAw903543wNZISk'
		}
	}
};

_.defaults(Meteor.settings, settings);

//ServiceConfiguration.configurations.upsert(
//	{ service: 'twitter' },
//	{
//		$set: {
//			consumerKey: Meteor.settings.twitter.consumerKey,
//			secret: Meteor.settings.twitter.secret
//		}
//	}
//);
