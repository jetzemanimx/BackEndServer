var Medico = require('../models/Medico');
var mdAuth = require('../middleware/auth');

module.exports = function(app) {
	//==============================================================
	//						Show all Medics
	//==============================================================
	//#region
	app.route('/Api/Medic/All')
		.get(function(req, res) {
            var Offset = req.query.Offset || 0;
			Offset = Number(Offset);
			Medico.find({})
				.populate('Usuario', 'personalData.Name personalData.Email')
                .populate('Hospital', 'Name')
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

						Medico.countDocuments({}, function(error, counter) {
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
	//						Create Medic
	//==============================================================
	//#region
	app.route('/Api/Medic/Insert').post(mdAuth.verifyToken, function(req, res) {
		var medico = new Medico();
		medico.personalData.Name = req.body.Name;
		medico.personalData.lastName = req.body.lastName;
		medico.personalData.Image = req.body.Image;
		medico.isActive = req.body.isActive;
		medico.Usuario = req.UserToken._id;
		medico.Hospital = req.body.idHospital;

		medico.save(function(error, data, callback) {
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
	//						Update Medic
	//==============================================================
	//#region
	app.route('/Api/Medic/Update/:id').patch(mdAuth.verifyToken, function(req, res) {
		Medico.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					'personalData.Name': req.body.Name,
					'personalData.lastName': req.body.lastName,
					'personalData.Image': req.body.Image,
					isActive: req.body.isActive,
					Usuario: req.UserToken._id,
					Hospital: req.body.Hospital,
				},
			},
			{ new: true },
			function(error, data) {
				if (error) {
					res.status(500).json(error);
				} else {
					if (!data) {
						return res.status(400).json({
							Message: 'Medico no encontrado',
							Errors: error,
						});
					} else {
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
	//                          Delete Medic
	//==============================================================
	//#region
	app.route('/Api/Medic/Delete/:id').delete(mdAuth.verifyToken, function(req, res) {
		Medico.findByIdAndRemove(req.params.id, function(error, data) {
			if (error) {
				res.status(500).json(error);
			} else {
				if (!data) {
					return res.status(400).json({
						Message: 'Medic no encontrado',
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
