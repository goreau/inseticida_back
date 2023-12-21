var knex = require("../database/connection");

class Natureza{
    //id_natureza, nome, id_tipo_base, id_regional, endereco, id_usuario, municipio, fone, ordem, deleted, created_at, updated_at
    async create(dados) {
        try {
          var { nome, codigo } = dados;
    
          const result = await knex
            .insert({
                nome, codigo
            })
            .table("natureza");
    
          return result;
        } catch (err) {
          console.log(err);
        }
      }
    
      async update(dados) {
        try {
          var {
            id_natureza, nome, codigo
          } = dados;
    
          await knex("natureza")
            .where("id_natureza", id_natureza)
            .update({
                nome, codigo
            });
        } catch (err) {
          console.log(err);
        }
      }
    
      
      async getNaturezas(filter) {
        try {
          var result = [];
    
          result = await knex
            .select("u.*")
            .table("natureza as u")
            .orderBy("id_natureza", "desc");
    
          return result;
        } catch (err) {
          console.log(err);
          return [];
        }
      }
    
      
      async getNatureza(id) {
        try {
          var result = [];
    
          result = await knex
            .select("u.*")
            .table("natureza as u")
            .where("id_natureza", "=", id);

          return result[0];
        } catch (err) {
          console.log(err);
          return [];
        }
      }
    
      async delete(id) {
        try {
          await knex.delete().where({ id_natureza: id }).table("natureza");
          return { status: true };
        } catch (err) {
          return { status: false, err: err };
        }
      }
    
    async getNaturezasCombo(){
        try{
            var result = await knex.select(["id_natureza","nome"])
            .table("natureza as u")
            .where({deleted: 0});
            return result;
        }catch(err){
            console.log(err);
            return [];
        }
    }

}

module.exports = new Natureza();