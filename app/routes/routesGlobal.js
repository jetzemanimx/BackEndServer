var jwt = require('jsonwebtoken');
var SEED = require('../../config/config').SEED;

module.exports = function(app) {
	//Ruta Inicial
	app.route('/')
		.get(function(req, res) {
			res.status(200).json({
				ok: true,
				mensaje: 'Peticion realizada por GET /',
			});
		})
		.post(function(req, res) {
			res.send('Post Response');
			res.status(200);
		})
		.put(function(req, res) {
			res.send('Put Response');
			res.status(200);
		});
};
