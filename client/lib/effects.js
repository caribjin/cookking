$.Velocity.RegisterEffect('pulse', {
	defaultDuration: 500,
	calls: [
		[ { scale: 3 }, 0.1 ],
		[ { scale: 0.7 }, 0.7 ],
		[ { scale: 1 }, 0.2 ]

	],
	reset: { scale: 1 }
});