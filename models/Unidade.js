var knex = require("../database/connection");

class Unidade{
    //id_unidade, nome, id_tipo_base, id_regional, endereco, id_usuario, municipio, fone, ordem, deleted, created_at, updated_at
    async create(dados) {
        try {
          var { nome, id_tipo_base, id_regional, endereco, id_usuario, municipio, fone, ordem } = dados;
    
          const result = await knex
            .insert({
                nome, id_tipo_base, id_regional, endereco, id_usuario, municipio, fone, ordem
            })
            .table("unidade");
    
          return result;
        } catch (err) {
          console.log(err);
        }
      }
    
      async update(dados) {
        try {
          var {
            id_unidade, nome, id_tipo_base, id_regional, endereco, id_usuario, municipio, fone, ordem
          } = dados;
    
          await knex("unidade")
            .where("id_unidade", id_unidade)
            .update({
                nome, id_tipo_base, id_regional, endereco, id_usuario, municipio, fone, ordem
            });
        } catch (err) {
          console.log(err);
        }
      }
    
      
      async getUnidades(filter) {
        try {
          var result = [];
    
          result = await knex
            .select("u.*")
            .table("unidade as u")
            .orderBy("id_unidade", "desc");
    
          return result;
        } catch (err) {
          console.log(err);
          return [];
        }
      }
    
      
      async getUnidade(id) {
        try {
          var result = [];
    
          result = await knex
            .select("u.*")
            .table("unidade as u")
            .where("id_unidade", "=", id);

          return result[0];
        } catch (err) {
          console.log(err);
          return [];
        }
      }
    
      async delete(id) {
        try {
          await knex.delete().where({ id_unidade: id }).table("unidade");
          return { status: true };
        } catch (err) {
          return { status: false, err: err };
        }
      }
    
    async getUnidadesCombo(){
        try{
            var result = await knex.select(["id_unidade","nome"])
            .table("unidade as u")
            .where({deleted: 0});
            return result;
        }catch(err){
            console.log(err);
            return [];
        }
    }

}

module.exports = new Unidade();