var User = require("../models/User");
//var PasswordToken = require("../models/PasswordToken");
var jwt = require("jsonwebtoken");

var secret = "ab79dc2eb520b1f578196d612c0d437219052c82c651114e82668dc358b451e4";

var bcrypt = require("bcrypt");


class UserController{
    async index(req, res){
        var users = await User.findAll();
        res.json(users);
    }

    async findUser(req, res){
        var id = req.params.id;
        var user = await User.findById(id);
        if(user == undefined){
            res.status(404);
            res.json({});
        }else{
            res.status(200)
            res.json(user);
        }
    }

    async getUser(req, res){
        var id = req.params.id;
        var user = await User.getUser(id);
        if(user == undefined){
            res.status(404);
            res.json({});
        }else{
            res.status(200)
            res.json(user);
        }
    }

    async getUsers(req, res){
      //  var id = req.params.id;
        var users = await User.findAll();
        if(users == undefined){
            res.status(404);
            res.json({});
        }else{
            res.status(200)
            res.json({data: users});
        }
    }

    async create(req, res){
        var {name, username, password, id_unidade, email, role, id_prop } = req.body;

        if(username == undefined){
            res.status(400);
            res.json({err: "O login é inválido!"})
            return;
        }

        var userExists = await User.findByUsername(username);

        if(userExists.id_usuario){
            res.status(406);
            res.json({err: "Esse nome de usuário já está cadastrado!"})
            return;
        }

        
        await User.new(name, username, password, id_unidade, email, role, id_prop);
        
        res.status(200);
        res.send("Tudo OK!");
    }

    async update(req, res){
        var user = req.body;

        if (user.old_password){
            let oldUser = await User.findById(user.id_usuario);

            var resultado = await bcrypt.compare(user.old_password, oldUser.password);

            if (!resultado){
                res.status(400);
                res.json({status: false,message:"A senha atual não está correta!"});
                return;
            }
        } else {
            res.status(400);
            res.json({status: false,message:"A senha atual não foi informada!"});
            return;
        }
        user.password = user.new_password;

        var ret = await User.update(user);
        
        res.status(200).send({data: "Tudo OK!"});
    }

    async edit(req, res){
        var user = req.body;

        var ret = await User.update(user);
        
        res.status(200).send({data: "Tudo OK!"});
    }

    async editOff(req, res){
        var {id, name, role, email} = req.body;
        var result = await User.update(id,email,name,role);
        if(result != undefined){
            if(result.status){
                res.status(200);
                res.send("Tudo OK!");
            }else{
                res.status(406);
                res.send(result.err)
            }
        }else{
            res.status(406);
            res.send("Ocorreu um erro no servidor!");
        }
    }

    async remove(req, res){
        var id = req.params.id;

        var result = await User.delete(id);

        if(result.status){
            res.status(200);
            res.send("Tudo OK!");
        }else{
            res.status(406);
            res.send(result.err);
        }
    }

    async recoverPassword(req, res){
        var email = req.body.email;
        var result = await PasswordToken.create(email);
        if(result.status){
           res.status(200);
           res.send("" + result.token);
        }else{
            res.status(406)
            res.send(result.err);
        }
    }

    async changePassword(req, res){
        var token = req.body.token;
        var password = req.body.password;
        var isTokenValid = await PasswordToken.validate(token);
        if(isTokenValid.status){
            await User.changePassword(password,isTokenValid.token.user_id,isTokenValid.token.token);
            res.status(200);
            res.send("Senha alterada");
        }else{
            res.status(406);
            res.send("Token inválido!");
        }
    }

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
                    res.json({name: user.nome, role: user.nivel, id: user.id_users, token: token});
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

module.exports = new UserController();