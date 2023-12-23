var knex = require("../database/sisawebDb");
const errorCode = require("../database/ErrorCode");

class Sisaweb{
    async findUser(username){
        try{

            var result = await knex.select(["id_usuario","email","login", "id_municipio", "senha","nivel","nome"])
            .where({login: username})
            .table("usuario");
            
            if(result.length > 0){
                return {status: true, user: result[0], err: null};
            }else{
                return {status: false, user: undefined, err: 'Não encontrado.'};
            }

        }catch(err){
            var msg = errorCode.getPgError(err.code);
            console.log(err);
            return { status: false, err: msg, user: undefined };;
        }
    }
}

module.exports = new Sisaweb();