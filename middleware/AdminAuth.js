var jwt = require("jsonwebtoken");
var secret = "ab79dc2eb520b1f578196d612c0d437219052c82c651114e82668dc358b451e4";

module.exports = function(req, res, next){
    const authToken = req.headers['authorization'];

    if(authToken != undefined){
        const bearer = authToken.split(' ');
        var token = bearer[1];

        try{
            var decoded = jwt.verify(token, secret);
            if(decoded){
                next();
            }
           
        
        }catch(err){
            console.log(err);
            res.status(403);
            res.send("Você não está autenticado");
            return;
        }
    }else{
        res.status(401);
        res.send("Você não está autenticado");
        return;
    }
}