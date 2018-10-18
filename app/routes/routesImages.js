var path = require('path');
var fs = require('fs');

module.exports = function(app) {
	app.route('/Api/Images/:tipo/:img').get(function(req, res) {
        var tipo = req.params.tipo;
        var img = req.params.img;

        var pathImagen = path.resolve( __dirname, '../uploads/' + tipo + '/' + img );

        if(fs.existsSync(pathImagen)){
            res.sendFile( pathImagen );
        }
        else{
            var pathNoImage = path.resolve( __dirname, '../assets/no-img.jpg');
            res.sendFile( pathNoImage );
        }

        // return res.status(200).json({
        //     ok: true,
        //     message: 'Peticion GET' + pathImagen,
        // });
    });
};
