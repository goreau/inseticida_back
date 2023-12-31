var knex = require("../database/connection");
var bcrypt = require("bcrypt");
const PasswordToken = require("./PasswordToken");
const errorCode = require("../database/ErrorCode");

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

            var result = await knex.select(["id_users","email","login", "id_unidade", "senha","nivel","nome","email_verified_at as check"])
            .where({login: username})
            .table("users");
            
            if(result.length > 0){
                return { status: true, err: null, user: result[0]};
            }else{
                return {status: false, err: 'Não encontrado.', user: null};
            }

        }catch(err){
            var msg = errorCode.getPgError(err.code);
            return {status: false, err: msg, user: null};
        }
    }

    async new(nome, login, senha, id_unidade, email, nivel, id_prop, active){
        try{
            var hash = await bcrypt.hash(senha, 10);

            var currentdate = new Date(); 
            var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth()+1)  + "-" + currentdate.getDate() + " "
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
          
            var created_at = datetime;
            var updated_at = datetime;

            const result = await knex.insert({nome, login, senha: hash, id_unidade, email, nivel, id_prop, active, created_at, updated_at}).table("users");
            
            return { status: true, err: null};
        }catch(err){
            var msg = errorCode.getPgError(err.code);
            return {status: false, err: msg};
        }
    } 

    async firstAccess(user){
        try {
            var hash = await bcrypt.hash(user.senha, 10);
            
            var currentdate = new Date(); 
            var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth()+1)  + "-" + currentdate.getDate() + " "
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();

            user.email_verified_at = datetime;
            user.senha = hash;

            var id = user.id_users;

            delete user.id_users;

            var result = await knex('users').where('id_users', id).update(user);
            return { status: true, err: null};   

        } catch (error) {
            var msg = errorCode.getPgError(error.code);
            return {status: false, err: msg};
        }
    }

    async update(user){
        var fields = {};
        var id = 0;
        try{
            for (var property in user) {
                if (!user.hasOwnProperty(property)) continue;
                if (user[property] == '') continue;
                if (property == 'id_users'){
                    id = user.id_users;
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

                var currentdate = new Date(); 
                var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth()+1)  + "-" + currentdate.getDate() + " "
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();
            
                var updated_at = datetime;
                fields['updated_at'] = updated_at;
            }
            
            await knex('users').where('id_users', id).update(fields);
            return { status: true, err: null};   
        }catch(err){
            var msg = errorCode.getPgError(err.code);
            return {status: false, err: msg};
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