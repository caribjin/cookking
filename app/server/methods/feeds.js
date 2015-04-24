Meteor.methods({
	createFeed: function(feed, isTweet, loc) {
		check(Meteor.userId(), String);
		check(feed, {
			recipeId: String,
			text: String,
			imageId: String
		});
		check(isTweet, Boolean);
		check(loc, Match.OneOf(Object, null));

		feed.writer = {
			id: Meteor.userId(),
			name: App.helpers.getCurrentUserName(),
			avatar: App.helpers.getCurrentUserAvatar()
		};
		feed.createdAt = new Date;

		if (!this.isSimulation && loc)
			feed.place = getLocationPlace(loc);

		var id = Feeds.insert(feed);

		if (!this.isSimulation && isTweet) {
			tweetFeed(feed);
		}

		return id;
	}
});

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

var getFeedImageData = function(feedImageId) {
	var res;

	res = Async.runSync(function(done) {
		var img = '';

		return Images.findOne(feedImageId).createReadStream().on('data', function(data) {
			return img += data.toString('base64');
		}).on('end', function() {
			return done(null, img);
		});
	});

	return res.result;
};

var tweetFeed = function(feed) {
	function appendTweet(text, append) {
		var MAX = 117; // 이미지 첨부시의 트윗 최대 글자 제한 수

		if ((text + append).length > MAX)
			return text.substring(0, (MAX - append.length - 3)) + '...' + append;
		else
			return text + append;
	}

	var image = getFeedImageData(feed.imageId);

	var response = callTwitter({
		method: 'post',
		url: 'https://upload.twitter.com/1.1/media/upload.json',
		form: { media: image }
	});

	if (response.statusCode !== 200)
		throw new Meteor.Error(500, 'Unable to post image to twitter');

	var attachment = JSON.parse(response.body);

	var response = callTwitter({
		method: 'post',
		url: 'https://api.twitter.com/1.1/statuses/update.json',
		form: {
			status: appendTweet(feed.text, ' #cookking'),
			media_ids: attachment.media_id_string
		}
	});

	if (response.statusCode !== 200)
		throw new Meteor.Error(500, 'Unable to create tweet');
};
