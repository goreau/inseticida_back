var User = require("../models/User");



class UserController{

    async login(req, res){
        var { username, password } = req.body;
    
        try {
            var user = await User.findByUsername(username);

            if(user != undefined){
                if (user.status && user.status == 0){
                    res.status(406);
                    res.json({status: false,message:"Credenciais incorretas!"});
                }
                var resultado = await bcrypt.compare(password,user.senha);

                if(resultado){

                    var token = jwt.sign({ id: user.id_users, name: user.nome, email: user.email, role: user.nivel }, secret, { expiresIn: 3600});

                    res.status(200);
                    res.json({name: user.nome, role: user.nivel, id: user.id_users, unidade: user.id_unidade, token: token});
                }else{
                    res.status(406);
                    var hash = await bcrypt.hash(password, 10);
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