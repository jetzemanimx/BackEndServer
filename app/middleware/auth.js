var jwt = require('jsonwebtoken');
var SEED = require('../../config/config').SEED;

    //==============================================================
	//                          Verify Token
	//==============================================================

    exports.verifyToken = function(req, res, next){
        var token = req.query.Token;

		jwt.verify(token, SEED, function(error, decoded) {
			if (error) {
				return res.status(401).json({
					Message: 'Token Invalido',
					Error: error,
				});
            }
            //console.log('Decoded-> ' , decoded.Usuario._id);
            req.UserToken = decoded.Usuario;
			next();
		});
    };