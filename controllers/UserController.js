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
        var {nome, login, senha, id_unidade, email, nivel, id_prop, active } = req.body;

        if(login == undefined){
            res.status(400);
            res.json({err: "O login é inválido!"})
            return;
        }

        var userExists = await User.findByUsername(login);

        if(userExists.user.id_users){
            res.status(406);
            res.json({msg: "Esse nome de usuário já está cadastrado!"})
            return;
        }

        
        var result = await User.new(nome, login, senha, id_unidade, email, nivel, id_prop, active);
        
        if(result.status){
            res.status(200);
            res.json({ msg: "Usuário cadastrado!"});
          }
          else 
          {
            console.log(result.err);
            res.status(400).json({msg: result.err});
          }
    }

    async firstAccess(req, res){
        var { login, senha } = req.body;

        var resp = await User.findByUsername(login);

        var id_users = resp.user.id_users;

        var result = await User.firstAccess({id_users,login,senha});
        
        if(result.status){
            res.status(200);
            res.json({ msg: "Usuário alterado!"});
        }
        else 
        {
            res.status(400).json({msg: result.err});
        }

    }

    async update(req, res){
        var user = req.body;

        if (user.old_senha){
            let oldUser = await User.findById(user.id_usuario);

            var resultado = await bcrypt.compare(user.old_senha, oldUser.senha);

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
        user.senha = user.new_senha;

        var ret = await User.update(user);
        
        if(ret.status){
            res.status(200);
            res.json({ msg: "Usuário alterado!"});
        }
        else 
        {
            res.status(400).json({msg: result.err});
        }
    }

    async edit(req, res){
        var user = req.body;

        var ret = await User.update(user);
        
        res.status(200).send({data: "Tudo OK!"});
    }

    async editOff(req, res){
        var {id, nome, nivel, email} = req.body;
        var result = await User.update(id,email,nome,nivel);
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
        var senha = req.body.senha;
        var isTokenValid = await PasswordToken.validate(token);
        if(isTokenValid.status){
            await User.changePassword(senha,isTokenValid.token.user_id,isTokenValid.token.token);
            res.status(200);
            res.send("Senha alterada");
        }else{
            res.status(406);
            res.send("Token inválido!");
        }
    }

    async login(req, res){
        var { login, senha } = req.body;
    
        try {
            var resp = await User.findByUsername(login);

            if (!resp.status){
                res.status(406);
                res.json({status: false,message:"Credenciais incorretas!"});
            } else if (!resp.user.check){
                res.status(406);
                res.json({status: false,message:"Alterar senha"});
            } else {
                var user = resp.user;
                console.log('aqui nao')
                    
                var resultado = await bcrypt.compare(senha,user.senha);

                if(resultado){

                    var token = jwt.sign({ id: user.id_users, nome: user.nome, email: user.email, nivel: user.nivel }, secret, { expiresIn: 3600});

                    res.status(200);
                    res.json({nome: user.nome, nivel: user.nivel, id: user.id_users, unidade: user.id_unidade, token: token});
                }else{
                    res.status(406);
                    res.json({status: false,message:"Senha incorreta!"});
                }
            }
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    }

}

module.exports = new UserController();