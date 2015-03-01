Meteor.methods({
	createFeed: function(feed, isTweet, loc) {
		check(Meteor.userId(), String);
		check(feed, {
			recipeId: String,
			text: String,
			image: String
		});
		check(isTweet, Boolean);
		check(loc, Match.OneOf(Object, null));

		feed.userId = Meteor.userId();
		feed.userAvatar = getUserAvatar(feed.userId);
		feed.createdAt = new Date;

		if (Meteor.user().profile && Meteor.user().profile.name) {
			feed.userName = Meteor.user().profile.name;
		}

		if (!this.isSimulation && loc)
			feed.place = getLocationPlace(loc);

		var id = Feeds.insert(feed);

		//if (!this.isSimulation && isTweet)
		//	tweetFeed(feed);

		return id;
	}
});

var getLocationPlace = function(loc) {
	var url = 'https://api.twitter.com/1.1/geo/reverse_geocode.json?' +
		'granularity=neighborhood&' +
		'max_results=1&' +
		'accuracy=' + loc.coords.accuracy + '&' +
		'lat=' + loc.coords.latitude + '&' +
		'long=' + loc.coords.longitude;

	var response = callTwitter({ method: 'get', url: url });

	if (response && response.statusCode === 200) {
		var data = JSON.parse(response.body);
		var place = _.find(data.result.places, function(place) {
			return place.place_type === 'neighborhood';
		});
		var placeName = '';

		if (!place) {
			place = data.result.places[0];
			placeName = place.place_type == 'city' ? place.country + ' ' + place.full_name : place.full_name;
		}
		return placeName;
	}
};

// Uses the Npm request module directly as provided by the request local pkg
var callTwitter = function(options) {
	var result = null;
	var userTwitterConfig = Meteor.user().services.twitter;

	if (userTwitterConfig) {
		var twitterConfig = Meteor.settings.authServices.twitter;

		options.oauth = {
			consumer_key: twitterConfig.consumerKey,
			consumer_secret: twitterConfig.secret,
			token: userTwitterConfig.accessToken,
			token_secret: userTwitterConfig.accessTokenSecret
		};

		result = Request(options);
	}

	return result;
};

//var tweetFeed = function(feed) {
//	// creates the tweet text, optionally truncating to fit the appended text
//	function appendTweet(text, append) {
//		var MAX = 117; // Max size of tweet with image attached
//
//		if ((text + append).length > MAX)
//			return text.substring(0, (MAX - append.length - 3)) + '...' + append;
//		else
//			return text + append;
//	}
//
//	// we need to strip the "data:image/jpeg;base64," bit off the data url
//	var image = feed.image.replace(/^data.*base64,/, '');
//
//	var response = callTwitter({
//		method: 'post',
//		url: 'https://upload.twitter.com/1.1/media/upload.json',
//		form: { media: image }
//	});
//
//	if (response.statusCode !== 200)
//		throw new Meteor.Error(500, 'Unable to post image to twitter');
//
//	var attachment = JSON.parse(response.body);
//
//	var response = callTwitter({
//		method: 'post',
//		url: 'https://api.twitter.com/1.1/statuses/update.json',
//		form: {
//			status: appendTweet(feed.text, ' #localmarket'),
//			media_ids: attachment.media_id_string
//		}
//	});
//
//	if (response.statusCode !== 200)
//		throw new Meteor.Error(500, 'Unable to create tweet');
//};

var getUserAvatar = function(userId) {
	var result = '';

	if (Meteor.user()) {
		if (Meteor.user().services.twitter) {
			result = Meteor.user().services.twitter.profile_image_url_https;
		}
	}

	return result;
};