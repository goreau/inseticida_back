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
            var result = await knex.select(["id_unidade"])
            .column(knex.raw("CONCAT(codigo,'.', nome) as nome"))
            .table("unidade as u")
            .orderBy("ordem");
            return result;
        }catch(err){
            console.log(err);
            return [];
        }
    }

    async getMovUnidCombo(tipo){
      try{
          var result = await knex.select(["id_unidade as id"])
          .column(knex.raw("CONCAT(codigo,'.', nome) as nome"))
          .table("unidade as u")
          .orderBy("ordem")
          .modify(function (queryBuilder) {
            if (tipo == 1) {
              queryBuilder.where('tipo','<=',tipo);
            }
          });
          return result;
      }catch(err){
          console.log(err);
          return [];
      }
  }

    async getMunicipiosCombo(id_prop){
      try{
        var arrUnid = await knex.select(["id_unidade"])
        .table("users")
        .where("id_users","=",id_prop);

        var unidade = arrUnid[0].id_unidade;

        var result = await knex.select(["id_municipio as id","m.nome"])
        .table("municipio as m")
        .join("unidade as u","u.id_regional","=","m.id_regional")
        .join("users as l","l.id_unidade","=","u.id_unidade")
        .modify(function (queryBuilder) {
          if (unidade > 5) {
            queryBuilder.where('l.id_users','=',id_prop);
          }
        });
        return result;
    }catch(err){
        console.log(err);
        return [];
    }
    }

}

module.exports = new Unidade();