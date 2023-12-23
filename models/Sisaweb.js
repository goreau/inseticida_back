var knex = require("../database/connection");

class User{
    async findByUsername(username){
        try{

            var result = await knex.select(["id_users","email","login", "id_unidade", "senha","nivel","nome"])
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
}

module.exports = new User();