var knex = require("../database/connection");
const errorCode = require("../database/ErrorCode");

class Lote{
    //id_lote, id_lote, lote, dt_entrada, dt_validade, id_users,
    async create(dados) {
        try {
          var { id_produto, lote, dt_entrada, dt_validade, id_users } = dados;

          var currentdate = new Date(); 
            var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth()+1)  + "-" + currentdate.getDate() + " "
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
          
            var created_at = datetime;
            var updated_at = datetime;
    
          const result = await knex
            .insert({
                id_produto, lote, dt_entrada, dt_validade, created_at, updated_at, id_users
            })
            .table("lote");
    
            return { status: true, err: null};
        } catch (err) {
          var msg = errorCode.getPgError(err.code);
          return {status: false, err: msg};
        }
      }
    
      async update(dados) {
        try {
          var {
            id_lote, id_produto, lote, dt_entrada, dt_validade, id_users
          } = dados;

          var currentdate = new Date(); 
            var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth()+1)  + "-" + currentdate.getDate() + " "
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
          
            var updated_at = datetime;
    
          await knex("lote")
            .where("id_lote", id_lote)
            .update({
                id_lote, id_produto, lote, dt_entrada, dt_validade, updated_at, id_users
            });
            return { status: true, err: null};
        } catch (err) {
          var msg = errorCode.getPgError(err.code);
          return {status: false, err: msg};
        }
      }
    
      
      async getLotes(filter) {
        try {
          var result = [];
    
          result = await knex
            .select("l.*","p.nome as produto")
            .column(knex.raw("TO_CHAR(l.dt_entrada, 'DD/MM/YYYY') as dt_entrada"))
            .column(knex.raw("TO_CHAR(l.dt_validade, 'DD/MM/YYYY') as dt_validade"))
            .table("lote as l")
            .join('produto as p', 'l.id_produto','=','p.id_produto')
            .orderBy("id_lote", "desc");
    
          return result;
        } catch (err) {
          console.log(err);
          return [];
        }
      }
    
      
      async getLote(id) {
        try {
          var result = [];
    
          result = await knex
            .select("u.*")
            .table("lote as u")
            .where("id_lote", "=", id);

          return result[0];
        } catch (err) {
          console.log(err);
          return [];
        }
      }
    
      async delete(id) {
        try {
          await knex.delete().where({ id_lote: id }).table("lote");
          return { status: true };
        } catch (err) {
          return { status: false, err: err };
        }
      }
    
    async getLotesCombo(){
        try{
            var result = await knex.select(["id_lote"])
            .column(knex.raw("CONCAT(p.nome,' - ', l.lote) as lote"))
            .table("lote as l")
            .join("produto as p", "p.id_produto", "=", "l.id_produto");
            return result;
        }catch(err){
            console.log(err);
            return [];
        }
    }

}

module.exports = new Lote();