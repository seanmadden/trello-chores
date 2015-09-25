const vows = require("vows"),
	assert = require("assert");


vows.describe("setting up cron jobs per list")
	.addBatch({
		'schedule card does not exist': {
			topic: null,

		}
	});
