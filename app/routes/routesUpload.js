var fileUpload = require('express-fileupload');
var uuid = require('node-uuid');
var Hospital = require('../models/Hospital');
var Medico = require('../models/Medico');
var Usuario = require('../models/Usuario');

module.exports = function(app) {
	app.use(fileUpload());
	//==============================================================
	//                          Upload
	//==============================================================
	//#region
	app.route('/Api/Upload/:tipo/:id').put(function(req, res) {
		var tipo = req.params.tipo;
		var id = req.params.id;

		//Validamos Archivos
		//#region
		if (!req.files) {
			return res.status(400).json({
				ok: false,
				message: 'Not Files',
			});
		}
		//#endregion

		//Obtenemos Archivo
		//#region
		var file = req.files.Image;
		var fileName = req.files.Image.name;
		var fileType = req.files.Image.mimetype;
		var fileExtension = req.files.Image.mimetype.split('/')[1];
		//#endregion

		//Extensiones Validas
		//#region
		var extensionValids = ['png', 'jpeg', 'jpg', 'gif'];

		if (extensionValids.indexOf(fileExtension) < 0) {
			return res.status(400).json({
				ok: false,
				message: 'Extension not valid',
				errors: 'Extension valid: ' + extensionValids.join(','),
			});
		}
		//#endregion

		//Nombre archivo personalizado
		//#region
		var fileName = uuid.v4() + '.' + fileExtension;
		//#endregion

		//Mover archivo
		//#region
		var typeValids = ['Hospitales', 'Medicos', 'Usuarios'];
		if (typeValids.indexOf(tipo) < 0) {
			return res.status(400).json({
				ok: false,
				message: 'Type not valid',
				errors: 'Type invalid: ' + typeValids.join(','),
			});
		}
		var path = './app/uploads/' + tipo + '/' + fileName;

		uploadByType(tipo, id, fileName, res);

		file.mv(path, function(error) {
			if (error) {
				return res.status(500).json({
					ok: false,
					error: error,
				});
			}
		});
		//#endregion
	});
	//#endregion
	
};

function uploadByType(tipo, id, fileName, res) {
	switch (tipo) {
		case 'Usuarios':
			Usuario.findById(id, function(error, data, callback) {
				if (error) {
					return res.status(500).json({
						ok: false,
						error: error,
						message: 'User not find',
					});
				}
				if (data != null) {
					data.personalData.Image = fileName;
					data.save(function(error, user, callback) {
						if (error) {
							return res.status(500).json({
								ok: false,
								error: error,
							});
						}
						return res.status(200).json({
							ok: true,
							message: 'Update Image Ok',
							Usuario: {
								Name: user.personalData.Name + ' ' + user.personalData.lastName,
								Image: user.personalData.Image,
							},
						});
					});
				} else {
					return res.status(500).json({
						ok: false,
						error: error,
						message: 'User not find',
					});
				}
			});
			break;

		case 'Medicos':
			Medico.findById(id, function(error, data, callback) {
				if (error) {
					return res.status(500).json({
						ok: false,
						error: error,
						message: 'Medic not find',
					});
				}

				if (data != null) {
					data.personalData.Image = fileName;
					data.save(function(error, medic, callback) {
						if (error) {
							return res.status(500).json({
								ok: false,
								error: error,
							});
						}
						return res.status(200).json({
							ok: true,
							message: 'Update Image Ok',
							Usuario: {
								Name: medic.personalData.Name + ' ' + medic.personalData.lastName,
								Image: medic.personalData.Image,
							},
						});
					});
				} else {
					return res.status(500).json({
						ok: false,
						error: error,
						message: 'Medic not find',
					});
				}
			});
			break;

		case 'Hospitales':
			Hospital.findById(id, function(error, data, callback) {
				if (error) {
					return res.status(500).json({
						ok: false,
						error: error,
						message: 'Hospital not find',
					});
				}

				if (data != null) {
					data.Image = fileName;
					data.save(function(error, hospital, callback) {
						if (error) {
							return res.status(500).json({
								ok: false,
								error: error,
							});
						}
						return res.status(200).json({
							ok: true,
							message: 'Update Image Ok',
							Usuario: {
								Name: hospital.Name,
								Image: hospital.Image,
							},
						});
					});
				} else {
					return res.status(500).json({
						ok: false,
						error: error,
						message: 'Hospital not find',
					});
				}
			});
			break;
	}
}
