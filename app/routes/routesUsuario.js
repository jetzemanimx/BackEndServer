const Usuario = require('../models/Usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../../config/config').SEED;
var mdAuth = require('../middleware/auth');

module.exports = function(app) {
	//==============================================================
	//						Show all Users
	//==============================================================
	app.route('/Api/Users/All')
		.get(mdAuth.verifyToken ,function(req, res) {
			Usuario.find(
				{},
				'personalData.Name personalData.lastName personalData.Image Role personalData.Email Google',
				function(error, data, callback) {
					if (error) {
						res.status(500).json(error);
					} else {
						res.status(201).json({
							data : data,
							userToken : req.UserToken
						});
					}
				}
			);
		})
		.post(function(req, res) {});

	//==============================================================
	//                          Login User
	//==============================================================

	app.route('/Api/Login').post(function(req, res) {
		Usuario.findOne({ 'personalData.Email': req.body.Email }, function(error, data) {
			if (error) {
				res.status(500).json(error);
			} else {
				if (!data) {
					return res.status(400).json({
						Message: 'Credenciales Incorrectas - Email',
						Errors: error,
					});
				}
				if (!bcrypt.compareSync(req.body.Password, data.personalData.Password)) {
					return res.status(400).json({
						Message: 'Credenciales Incorrectas - Password',
						Errors: error,
					});
				}
				//==============================================================
				//                          Creamos Token
				//==============================================================
				data.personalData.Password = ':)';
				var Token = jwt.sign({ Usuario: data.personalData }, SEED, { expiresIn: 14400 });
				data.JWT = Token;
				res.status(200).json(data);
			}
		});
	});

	//==============================================================
	//						Create User
	//==============================================================
	app.route('/Api/Users/Insert').post( mdAuth.verifyToken ,function(req, res) {
		var user = new Usuario();
		user.personalData.Name = req.body.Name;
		user.personalData.lastName = req.body.lastName;
		user.personalData.Email = req.body.Email;
		user.personalData.Password = bcrypt.hashSync(req.body.Password, 10);
		user.personalData.Image = req.body.Image;
		user.Role = req.body.Role;

		user.save(function(error, data, callback) {
			if (error) {
				res.status(400).json(error);
			} else {
				res.status(201).json({
					data : data,
					userToken : req.UserToken
				});
			}
		});
	});

	//==============================================================
	//						Update User
	//==============================================================
	app.route('/Api/Users/Update/:id').patch(mdAuth.verifyToken, function(req, res) {
		Usuario.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					'personalData.Name': req.body.Name,
					'personalData.lastName': req.body.lastName,
					'personalData.Email': req.body.Email,
					'personalData.Image': req.body.Image,
					Role: req.body.Role,
					Google: req.body.Google,
					isActive: req.body.isActive,
				},
			},
			function(error, data) {
				if (error) {
					res.status(500).json(error);
				} else {
					if (!data) {
						return res.status(400).json({
							Message: 'Usuario no encontrado',
							Errors: error,
						});
					} else {
						data.personalData.Password = ':)';
						res.status(200).json({
							data : data,
							userToken : req.UserToken
						});
					}
				}
			}
		);
	});

	//==============================================================
	//                          Delete User
	//==============================================================
	app.route('/Api/Users/Delete/:id').delete(mdAuth.verifyToken, function(req, res) {
		Usuario.findByIdAndRemove(req.params.id, function(error, data) {
			if (error) {
				res.status(500).json(error);
			} else {
				if (!data) {
					return res.status(400).json({
						Message: 'Usuario no encontrado',
						Errors: error,
					});
				}
				res.status(200).json({
					data : data,
					userToken : req.UserToken
				});
			}
		});
	});
};
