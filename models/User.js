var knex = require("../database/connection");
var bcrypt = require("bcrypt");
const PasswordToken = require("./PasswordToken");

class User{

    async findAll(){
        try{
            var result = await knex.select(["u.id_users","email","u.nome", "login", "u.id_prop", "un.nome as unidade"])
            .column(knex.raw("(CASE nivel WHEN 1 THEN 'Administrador' WHEN 2 THEN 'Gestor Regional' ELSE 'Usuário Setor' END) as role"))
            .table("users as u")
            .join("unidade as un","un.id_unidade", '=' , "u.id_unidade")
            .where({ 'u.active': true});
            return result;
        }catch(err){
            console.log(err);
            return [];
        }
    }

    async findById(id){
        try{
            var result = await knex.select(["u.id_users","email","u.nome", "nivel", "u.id_unidade", "u.login", "u.senha", "un.nome as unidade"])        
            .where({'u.id_users': id})
            .table("users as u")
            .join("unidade as un","un.id_unidade", '=' , "u.id_unidade");
            
            if(result.length > 0){
                return result[0];
            }else{
                return undefined;
            }

        }catch(err){
            console.log(err);
            return undefined;
        }
    }

    async getUser(id){
        try{
            var user = await knex.select(["u.id_users","email","nivel","u.nome", "u.id_unidade", "u.login", "u.senha", "un.nome as unidade"])
            .where({'u.id_users': id})
            .table("users as u")
            .join("unidade as un","un.id_unidade", '=' , "u.id_unidade");

            if(user.length > 0){               
                return user[0];
            }else{
                return undefined;
            }

        }catch(err){
            console.log(err);
            return undefined;
        }
    }

    async findByUsername(username){
        try{

            var result = await knex.select(["id_users","email","login", "senha","nivel","nome"])
            .where({login: username})
            .table("users");
            
            if(result.length > 0){
                return result[0];
            }else{
                return {status: 0, err: 'Não encontrado.'};
            }

        }catch(err){
            console.log(err);
            return undefined;
        }
    }

    async new(name, username, password, id_unidade, email, role, id_prop){
        try{
            var hash = await bcrypt.hash(password, 10);
            await knex.insert({name, username, password: hash, id_unidade, email, role, id_prop}).table("usuario");
        }catch(err){
            console.log(err);
        }
    } 

    async update(user){
        var fields = {};
        var id = 0;
        try{
            for (var property in user) {
                if (!user.hasOwnProperty(property)) continue;
                if (user[property] == '') continue;
                if (property == 'id_usuario'){
                    id = user.id_usuario;
                    continue;
                }
                if (property == 'old_password'){
                    continue;
                }
                if (property == 'new_password'){
                    continue;
                }
                
                if (property == 'password'){
                    var hash = await bcrypt.hash(user[property], 10);
                    user[property] = hash;
                }
                fields[property] = user[property];
            }
            
            await knex('usuario').where('id_usuario', id).update(fields);
               
        }catch(err){
            console.log(err);
        }
    } 
    
    
    async findEmail(email){
        try{
            var result = await knex.select("*").from("usuario").where({email: email});
            
            if(result.length > 0){
                return true;
            }else{
                return false;
            }

        }catch(err){
            console.log(err);
            return false;
        }
    }

    async updateReserva(id,email,name,role){
        console.log('aqui sim');

        return 'funfas';

/*
        var user = await this.findById(id);

        if(user != undefined){

            var editUser = {};

            if(email != undefined){ 
                if(email != user.email){
                   var result = await this.findEmail(email);
                   if(result == false){
                        editUser.email = email;
                   }else{
                        return {status: false,err: "O e-mail já está cadastrado"}
                   }
                }
            }

            if(name != undefined){
                editUser.name = name;
            }

            if(role != undefined){
                editUser.role = role;
            }

            try{
                await knex.update(editUser).where({id: id}).table("usuario");
                return {status: true}
            }catch(err){
                return {status: false,err: err}
            }
            
        }else{
            return {status: false,err: "O usuário não existe!"}
        }*/
    }

    async delete(id){
        try{
          
          await knex('usuario').where('id_usuario', id)
          .update({ deleted: 1 });
          //console.log('deletado ' + id); 
        }catch(err){
            console.log(err);
        }
    } 

    async changePassword(newPassword,id,token){
        var hash = await bcrypt.hash(newPassword, 10);
        await knex.update({password: hash}).where({id: id}).table("usuario");
        await PasswordToken.setUsed(token);
    }
}

module.exports = new User();