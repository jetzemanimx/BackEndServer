var Hospital = require('../models/Hospital');
var Medico = require('../models/Medico');
var Usuario = require('../models/Usuario');

module.exports = function(app) {
	//==============================================================
	//                          Busqueda General
	//==============================================================
	//#region
	app.route('/Api/Search/:Param').get(function(req, res) {
		var Search = req.params.Param;
		var ExpReg = new RegExp(Search, 'i');

		Promise.all([buscarHospitales(Search, ExpReg), buscarMedicos(Search, ExpReg), buscarUsuarios(Search, ExpReg)])
			.then(result => {
				res.status(200).json({
					ok: true,
					Hospitales: result[0],
					Medicos: result[1],
					Usuarios: result[2],
				});
			})
			.catch(error => {
				res.status(500).json({
					ok: false,
					data: error,
				});
			});
	});
	//#endregion

	//==============================================================
	//                          Busqueda Medicos
    //==============================================================
    //#region 
	app.route('/Api/Search/:Coleccion/:Param').get(function(req, res) {
        var Search = req.params.Param;
        var Coleccion = req.params.Coleccion;
        var ExpReg = new RegExp(Search, 'i');
        var Promesa;
        
        switch(Coleccion){
            case 'Usuarios':
            Promesa = buscarUsuarios(Search, ExpReg);
            break;

            case 'Medicos':
            Promesa = buscarMedicos(Search, ExpReg);
            break;

            case 'Hospitales':
            Promesa = buscarHospitales(Search, ExpReg);
            break;
            default:
            return res.status(400).json({
                ok: false,
                message: 'Los tipos de busqueda solo son Medicos, Usuarios, Hospitales',
            });
            break;
        }

        Promesa.then(result => {
            res.status(200).json({
                ok: true,
                data: result
            });
        }).catch(error =>{
            res.status(400).json({
                ok: false,
                error: error,
            });
        });
    });
    //#endregion
};

function buscarHospitales(Search, ExpReg) {
	return new Promise(function(resolve, reject) {
		Hospital.find({ Name: ExpReg })
			.populate(
				'Usuario',
				'personalData.Name personalData.lastName personalData.Image Role personalData.Email Google'
			)
			.exec(function(error, data, callback) {
				if (error) {
					reject('Error al cargar Hospitales', error);
				} else {
					resolve(data);
				}
			});
	});
}

function buscarMedicos(Search, ExpReg) {
	return new Promise(function(resolve, reject) {
		Medico.find({ 'personalData.Name': ExpReg })
			.populate(
				'Usuario',
				'personalData.Name personalData.lastName personalData.Image Role personalData.Email Google'
			)
			.populate('Hospital', 'Name')
			.exec(function(error, data, callback) {
				if (error) {
					reject('Error al cargar Hospitales', error);
				} else {
					resolve(data);
				}
			});
	});
}

function buscarUsuarios(Search, ExpReg) {
	return new Promise(function(resolve, reject) {
		Usuario.find({}, 'personalData.Name personalData.lastName personalData.Image Role personalData.Email Google')
			.or([
				{ 'personalData.Name': ExpReg },
				{
					'personalData.Email': ExpReg,
				},
			])
			.exec(function(error, data, callback) {
				if (error) {
					reject('Error al cargar Usuarios', error);
				} else {
					resolve(data);
				}
			});
	});
}
