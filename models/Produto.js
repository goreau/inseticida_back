var knex = require("../database/connection");

class Produto{
    //id_produto, nome, codigo, unidade, created_at, updated_at
    async create(dados) {
        try {
          var { nome, codigo, unidade } = dados;
    
          const result = await knex
            .insert({
                nome, codigo, unidade
            })
            .table("produto");
    
          return result;
        } catch (err) {
          console.log(err);
        }
      }
    
      async update(dados) {
        try {
          var {
            id_produto, nome, codigo, unidade
          } = dados;
    
          await knex("produto")
            .where("id_produto", id_produto)
            .update({
                nome, codigo, unidade
            });
        } catch (err) {
          console.log(err);
        }
      }
    
      
      async getProdutos(filter) {
        try {
          var result = [];
    
          result = await knex
            .select("u.*")
            .column(knex.raw("(CASE unidade WHEN '1' THEN 'Kg' WHEN '2' THEN 'Litro' ELSE 'Unid' END) as unidade"))
            .table("produto as u")
            .orderBy("id_produto", "desc");
    
          return result;
        } catch (err) {
          console.log(err);
          return [];
        }
      }
    
      
      async getProduto(id) {
        try {
          var result = [];
    
          result = await knex
            .select("u.*")
            .table("produto as u")
            .where("id_produto", "=", id);

          return result[0];
        } catch (err) {
          console.log(err);
          return [];
        }
      }
    
      async delete(id) {
        try {
          await knex.delete().where({ id_produto: id }).table("produto");
          return { status: true };
        } catch (err) {
          return { status: false, err: err };
        }
      }
    
    async getProdutosCombo(){
        try{
            var result = await knex.select(["id_produto","nome"])
            .table("produto as u")
            return result;
        }catch(err){
            console.log(err);
            return [];
        }
    }

}

module.exports = new Produto();