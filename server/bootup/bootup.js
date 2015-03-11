Meteor.startup(function() {
	setUsers(Fixtures.users);

	setFixture(Fixtures.recipes, Recipes);
	setFixture(Fixtures.news, News);
	setFixture(Fixtures.feeds, Feeds);

	Fixtures = {};

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

	function setFixture(fixtures, collection) {
		if (collection.find().count() <= 0) {
			_.map(fixtures, function(fixture, key) {
				if (!fixture.hasOwnProperty('createdAt')) {
					fixture.createdAt = new Date();
				}
				if (fixtures === Fixtures.recipes) {
					fixture.bookmarkedCount = 0;
				}
				collection.insert(fixture);
			});
		}
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
});