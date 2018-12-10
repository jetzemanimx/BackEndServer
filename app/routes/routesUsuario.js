var Usuario = require('../models/Usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../../config/config').SEED;
var CLIENT_ID = require('../../config/config').CLIENT_ID;
var mdAuth = require('../middleware/auth');

//Google
var { OAuth2Client } = require('google-auth-library');
var client = new OAuth2Client(CLIENT_ID);

module.exports = function(app) {
	//==============================================================
	//						Show all Users
	//==============================================================
	//#region
	app.route('/Api/Users/All')
		.get(function(req, res) {
			var Offset = req.query.Offset || 0;
			Offset = Number(Offset);
			Usuario.find(
				{},
				'personalData.Name personalData.lastName personalData.Image Role personalData.Email Google'
			)
				.skip(Offset)
				.limit(5)
				.exec(function(error, data, callback) {
					if (error) {
						res.status(500).json(error);
					} else {
						if (!data) {
							return res.status(204).json({
								Message: 'No existen datos',
								Data: data,
							});
						}

						Usuario.countDocuments({}, function(error, counter) {
							if (error) {
								res.status(500).json(error);
							} else {
								res.status(200).json({
									data: data,
									total: counter,
								});
							}
						});
					}
				});
		})
		.post(function(req, res) {});
	//#endregion

	//==============================================================
	//                          Login User
	//==============================================================
	//#region
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
				var Token = jwt.sign({ Usuario: data }, SEED, { expiresIn: 14400 });
				data.JWT = Token;
				res.status(200).json(data);
			}
		});
	});
	//#endregion

	//==============================================================
	//                          Login User Google
	//==============================================================
	//#region

	async function verify(token) {
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
			// Or, if multiple clients access the backend:
			//[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
		});
		const payload = ticket.getPayload();
		//const userid = payload['sub'];
		// If request specified a G Suite domain:
		//const domain = payload['hd'];
		//console.log(payload);
		return {
			nombre: payload.name,
			email: payload.email,
			img: payload.picture,
			google: payload.email_verified
			//payload : payload
		}
	};

	app.route('/Api/Login/Google').post(async function(req, res) {

		var token = req.body.idToken;

		var googleUser = await verify(token)
		.then(resolve => { 
			Usuario.findOne({"personalData.Email" : resolve.email}, function(error, data, callback){
				if (error) {
					return res.status(500).json(error);
				} 
					if(data){
						if(data.Google === false){
							return res.status(400).json({
								ok: false,
								message: "Debe usar autenticación normal"
							});
						}else{
							data.personalData.Password = ':)';
							var Token = jwt.sign({ Usuario: data }, SEED, { expiresIn: 14400 });
							data.JWT = Token;
							res.status(200).json(data);
						}
					}
					else{
						//==============================================================
						//                          El usuario no existe
						//==============================================================

						var user = new Usuario();
						user.personalData.Name = resolve.nombre;
						user.personalData.lastName = resolve.nombre;
						user.personalData.Email = resolve.email;
						user.personalData.Password = ":)";
						user.personalData.Image = resolve.img;
						user.Role = "USER_ROLE";
						user.Google = true;
				
						user.save(function(error, data, callback) {
							if (error) {
								res.status(400).json(error);
							} else {
								var Token = jwt.sign({ Usuario: data }, SEED, { expiresIn: 14400 });
								data.JWT = Token;
								return res.status(200).json(data);
							}
						});
					}
			});
		})
		.catch(reject => {
			return res.status(403).json({
				ok : false,
				Message: 'Invalid Token Google',
				Errors: reject,
			});
		});

		// return res.status(200).json({
		// 	ok : true,
		// 	Message: 'Ok!!!',
		// 	GoogleUser : googleUser
		// });
	});
	//#endregion

	//==============================================================
	//						Create User
	//==============================================================
	//#region
	app.route('/Api/Users/Insert').post(mdAuth.verifyToken, function(req, res) {
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
					data: data,
					userToken: req.UserToken,
				});
			}
		});
	});
	//#endregion

	//==============================================================
	//						Update User
	//==============================================================
	//#region
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
							data: data,
							userToken: req.UserToken,
						});
					}
				}
			}
		);
	});
	//#endregion

	//==============================================================
	//                          Delete User
	//==============================================================
	//#region
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
					data: data,
					userToken: req.UserToken,
				});
			}
		});
	});
	//#endregion
};
