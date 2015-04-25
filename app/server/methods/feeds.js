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
	},

	createFeedExt: function(feed, isTweet, loc) {
		check(Meteor.userId(), String);
		check(feed, {
			recipeId: String,
			text: String,
			imageId: String,
			image: String,
			mimeType: String
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

		var id = Feeds.insert(_.omit(feed, 'image'));

		if (!this.isSimulation && isTweet) {
			tweetFeed(feed);
		}

		return id;
	}
});

var tweetFeed = function(feed) {
	function appendTweet(text, append) {
		var MAX = 117; // 이미지 첨부시의 트윗 최대 글자 제한 수

		if ((text + append).length > MAX)
			return text.substring(0, (MAX - append.length - 3)) + '...' + append;
		else
			return text + append;
	}

	var image = '';

	if (feed.image) {
		// TODO: client로부터 직접 image string을 받아서 tweet하면, crop된 이미지가 아닌 전체이미지가 저장된다는 결함을
		// 가지고 있음. 궁극적으로는 getFeedImageData()를 통한 image를 저장해야 한다.
		image = feed.image.replace('data:' + feed.mimeType + ';base64,', '');
	} else {
		getFeedImageData(feed.imageId);
	}

	if (!image) {
		console.log('image object empty!');
		return;
	}

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
	var res = Async.runSync(function(done) {
		var img = '';

		return Images.findOne(feedImageId).createReadStream().on('data', function(data) {
			img += data.toString('base64');
		}).on('end', function() {
			return done(null, img);
		});
	});

	return res.result;
};

var getFeedImageDataFiber = function(feedImageId) {
	var f = new Future();

	var img = '';

	Images.findOne(feedImageId).createReadStream().on('data', function(data) {
		img += data.toString('base64');
	}).on('end', function() {
		return f.return(img);
	});

	return f.wait();
};
