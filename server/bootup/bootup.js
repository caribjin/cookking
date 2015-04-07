Meteor.startup(function() {
	Future = Npm.require('fibers/future');

	// 샘플 레시피를 100개 생성
	generateFixtureData(100);

	initVersionInfo();
	createServiceConfiguration();
	smtpMailConfiguration();

	function setUsers(users) {
		_.map(users, function(user, key) {
			var userExists = !!Meteor.users.findOne({ username: user.username });
			if (!userExists) {
				Accounts.createUser(user);
			}
		});
	}

	function createServiceConfiguration() {
		var services = Meteor.settings.authServices;

		if (!services) return;

		_.map(services, function(service, key) {
			ServiceConfiguration.configurations.remove({
				service: key
			});

			ServiceConfiguration.configurations.insert(service);
		});
	}

	function smtpMailConfiguration() {
		process.env.MAIL_URL = 'smtp://' +
		Meteor.settings.mailgun.default_smtp_login + ':' +
		Meteor.settings.mailgun.default_password + '@' +
		Meteor.settings.mailgun.smtp_host + ':587';
	}

	function generateFixtureData(count) {
		var recipe = {}, seed = {};

		if (Recipes.find().count() <= 0) {
			seed = {
				"title" : "",
				"description" : "맛있게 만들어 먹을 수 있는 더미 요리 레시피입니다. 다 같이 만들어 보아요",
				"imageId" : "$imageId$",
				"public" : true,
				"serving" : 0,
				"cookTime" : 0,
				"source" : {
					"name" : "홍길동",
					"url" : "http://www.google.com"
				},
				"ingredients" : {
					"must" : [
						"소고기 (800g)",
						"송이버섯 (5송이)",
						"마늘 (2개)",
						"부추 (1/3줌)",
						"간장 (2큰술)",
						"계란 (3개)"
					],
					"option" : [
						"고추 (1개)",
						"양파 (반개)",
						"통후추 (약간)",
						"고추장 (한큰술)"
					]
				},
				"directions" : [
					{
						"imageData" : "",
						"text" : "조리방법 첫번째 입니다. 조리를 시작하기 전에 가벼운 스트레칭으로 관절을 풀어주세요. 하기 싫으면 안해도 됩니다."
					}, {
						"imageData" : "",
						"text" : "먼저 칼을 번쩍번쩍하게 잘 갈고, 도마는 올리브유를 발라 기름기가 좔좔 흐르게 닦아줍니다. 칼은 전설의 의천검이 좋습니다."
					}, {
						"imageData" : "",
						"text" : "본격적으로 요리를 만듭니다. 있는 실력을 최대한 발휘해서 엄청 맛깔시런 요리를 만들어 주세요. 저는 요리 못합니다."
					}, {
						"imageData" : "",
						"text" : "거의 다 만들었습니다. 조금만 더 힘을 내주세요"
					}, {
						"imageData" : "",
						"text" : "드디어 완성됐습니다! 남편 혹은 아내, 혹은 여자친구, 남자친구와 맛나게 먹습니다. 맛없다고 서로 의 상하는 일은 없어야 합니다. 맛있다고 해줍시다. 꼭입니다. 꼭!"
					}
				],
				"highlighted" : false,
				"bookmarkedCount" : 0,
				"favoritesCount": 0,
				"commentsCount": 0,
				"filter": '',
				"writer" : {
					"id" : "",
					"name" : "Youngjin Lim",
					"avatar" : "https://pbs.twimg.com/profile_images/572022592865710080/OjhpMRR-_normal.jpeg"
				},
				"createdAt" : new Date()
			};

			for (var i=0; i<count; i++) {
				recipe = seed;

				recipe.title = '황금 요리레시피 ' + i;
				recipe.serving = _.random(1, 10);
				recipe.cookTime = _.random(1, 60);
				recipe.createdAt = moment().subtract(i, 'days').format();
				recipe.filter = 'category-' + _.random(0, 9);

				recipe = generateRecipeImage(recipe);

				_.map(recipe.directions, function(direction, index) {
					generateDirectionImage(direction);
				});

				Recipes.insert(recipe);
			}

			var firstDoc = Recipes.findOne({}, {sort: {createdAt: 1}});
			Recipes.update({_id: firstDoc._id}, {$set: {highlighted: true}});
		}
	}

	function generateRecipeImage(recipe) {
		var f = new Future();

		var imagePath = '/home/caribjin/meteor/cookking/public/img/recipes/640x800/' + _.random(1, 28) + '.jpg'

		Images.insert(imagePath, function(error, file) {
			if (error) {
				f.throw(error);
			}

			recipe.imageId = file._id;
			f.return(recipe);
		});

		return f.wait();
	}

	function generateDirectionImage(direction) {
		var f = new Future();

		var imagePath = '/home/caribjin/meteor/cookking/public/img/recipes/320x350/' + _.random(1, 28) + '.jpg'

		var fs = Npm.require('fs');
		var content = fs.readFileSync(imagePath);

		direction.imageData = 'data:image/jpeg;base64,' + content.toString('base64');
		f.return(direction);

		f.wait();
	}

	/**
	 * Application의 버전정보 컬렉션을 초기화
	 */
	function initVersionInfo() {
		if (Version.find().count() > 0) {
			Version.remove({});
		}

		Version.insert(JSON.parse(Assets.getText('version.json')));
	}
});