var knex = require("../database/connection");
const errorCode = require("../database/ErrorCode");

class Revalida{
    //id_revalida, id_lote, dt_validade, id_users, created_at, updated_at
    async create(dados) {
        try {
          var { id_lote, dt_validade, id_users } = dados;

          var currentdate = new Date(); 
            var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth()+1)  + "-" + currentdate.getDate() + " "
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
          
            var created_at = datetime;
            var updated_at = datetime;
    
          const result = await knex
            .insert({
                id_lote, dt_validade, created_at, updated_at, id_users
            })
            .table("revalida");
    
          return { status: true, err: null};
        } catch (err) {
          var msg = errorCode.getPgError(err.code);
          return {status: false, err: msg};
        }
      }
    
      async update(dados) {
        try {
          var {
            id_revalida, id_lote, dt_validade, id_users
          } = dados;

          var currentdate = new Date(); 
            var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth()+1)  + "-" + currentdate.getDate() + " "
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
          
            var updated_at = datetime;
    
          await knex("revalida")
            .where("id_revalida", id_revalida)
            .update({
                id_lote, dt_validade, updated_at, id_users
            });
          return { status: true, err: null};
        } catch (err) {
          var msg = errorCode.getPgError(err.code);
          return {status: false, err: msg};
        }
      }
    
      
      async getRevalidas(filter) {
        try {
          var result = [];
    
          result = await knex
            .select(["u.*","l.lote", "p.nome as produto"])
            .column(knex.raw("TO_CHAR(l.dt_validade, 'DD/MM/YYYY') as original"))
            .column(knex.raw("TO_CHAR(u.dt_validade, 'DD/MM/YYYY') as dt_validade"))
            .table("revalida as u")
            .join('lote as l', 'l.id_lote','=','u.id_lote')
            .join('produto as p', 'l.id_produto','=','p.id_produto')
            .orderBy("id_revalida", "desc");
    
          return result;
        } catch (err) {
          console.log(err);
          return [];
        }
      }
    
      
      async getRevalida(id) {
        try {
          var result = [];
    
          result = await knex
            .select("u.*")
            .table("revalida as u")
            .where("id_revalida", "=", id);

          return result[0];
        } catch (err) {
          console.log(err);
          return [];
        }
      }
    
      async delete(id) {
        try {
          await knex.delete().where({ id_revalida: id }).table("revalida");
          return { status: true };
        } catch (err) {
          return { status: false, err: err };
        }
      }
    
    async getRevalidasCombo(){
        try{
            var result = await knex.select(["id_revalida","nome"])
            .table("revalida as u")
            .where({deleted: 0});
            return result;
        }catch(err){
            console.log(err);
            return [];
        }
    }

}

module.exports = new Revalida();


