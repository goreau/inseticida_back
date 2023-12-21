require('dotenv').config();
class HomeController{

    async index(req, res){
        res.send("Servidor ON");
    }

    async validate(req, res){
        res.send("Servidor ON");
    }

}

module.exports = new HomeController();