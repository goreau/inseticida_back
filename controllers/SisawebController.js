var Sisaweb = require("../models/Sisaweb");



class SisawebController{

    async login(req, res){
        var { username, password } = req.body;
    
        try {
            var resp = await Sisaweb.findUser(username);
            
            if(resp != undefined){
                if (!resp.status){
                    res.status(406);
                    res.json({status: false,message:"Credenciais incorretas!"});
                }
                var user = resp.user;
                var resultado = password.trim() === user.senha.trim();

                if(resultado){
                    res.status(200);
                    res.json({name: user.nome, nivel: user.nivel, id: user.id_usuario, local: user.id_municipio, login: user.login});
                }else{
                    res.status(406);
                    res.json({status: false,message:"Senha incorreta!"});
                }

            }else{
                res.json({status: false, message:"Erro de comunicação com o banco de dados!"});
            }
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    }

}

module.exports = new SisawebController();