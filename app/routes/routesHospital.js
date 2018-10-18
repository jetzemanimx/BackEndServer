var Hospital = require('../models/Hospital');
var mdAuth = require('../middleware/auth');

module.exports = function(app) {
	//==============================================================
	//						Show all Hospitals
	//==============================================================
	//#region
	app.route('/Api/Hospital/All')
		.get(function(req, res) {
			var Offset = req.query.Offset || 0;
			Offset = Number(Offset);
			Hospital.find({})
				.populate('Usuario', 'personalData.Name personalData.Email')
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

						Hospital.countDocuments({}, function(error, counter) {
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
	//                          Find Hospital by ID
	//==============================================================
	//#region
	app.route('/Api/Hospital/Find/:id').get(function(req, res) {
		Hospital.findById(req.params.id)
			.populate('Usuario', 'personalData.Name personalData.Email')
			.exec(function(err, data) {
				if (err) return handleError(err);
				res.status(200).json(data);
				// prints "The author is Ian Fleming"
			});
	});
	//#endregion

	//==============================================================
	//						Create Hospital
	//==============================================================
	//#region
	app.route('/Api/Hospital/Insert').post(mdAuth.verifyToken, function(req, res) {
		var hospital = new Hospital();
		hospital.Name = req.body.Name;
		hospital.Image = req.body.Image;
		hospital.Usuario = req.UserToken._id;

		hospital.save(function(error, data, callback) {
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
	//						Update Hospital
	//==============================================================
	//#region
	app.route('/Api/Hospital/Update/:id').patch(mdAuth.verifyToken, function(req, res) {
		Hospital.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					Name: req.body.Name,
					Image: req.body.Image,
					isActive: req.body.isActive,
				},
			},
			{ new: true },
			function(error, data) {
				if (error) {
					res.status(500).json(error);
				} else {
					if (!data) {
						return res.status(400).json({
							Message: 'Hospital no encontrado',
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
	//                          Delete Hospital
	//==============================================================
	//#region
	app.route('/Api/Hospital/Delete/:id').delete(mdAuth.verifyToken, function(req, res) {
		Hospital.findByIdAndRemove(req.params.id, function(error, data) {
			if (error) {
				res.status(500).json(error);
			} else {
				if (!data) {
					return res.status(400).json({
						Message: 'Hospital no encontrado',
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
