var knex = require("../database/connection");
const errorCode = require("../database/ErrorCode");

class Movimento{
    //id_movimento, tipo, id_lote, dt_movimento, id_unidade, or_dest, quantidade, id_users, master
	
    async create(dados) {
        try {
          var { tipo, id_lote, dt_movimento, id_unidade, or_dest, quantidade, id_users, master } = dados;
          var currentdate = new Date(); 
          var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth()+1)  + "-" + currentdate.getDate() + " "
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
          
          var created_at = datetime;
          var updated_at = datetime;
          const result = await knex
            .insert({
                tipo, id_lote, dt_movimento, id_unidade, or_dest, quantidade, id_users, master, created_at, updated_at
            })
            .table("movimento");
    
          return { status: true, err: null};
        } catch (err) {
          var msg = errorCode.getPgError(err.code);
          console.log(err);
          return { status: false, err: msg };
        }
      }
    
      async update(dados) {
        try {
          var {
            id_movimento, tipo, id_lote, dt_movimento, id_unidade, or_dest, quantidade, id_users, master
          } = dados;
          var currentdate = new Date(); 
          var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth()+1)  + "-" + currentdate.getDate() + " "
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
          
          var updated_at = datetime;
    
          await knex("movimento")
            .where("id_movimento", id_movimento)
            .update({
                tipo, id_lote, dt_movimento, id_unidade, or_dest, quantidade, id_users, master, updated_at
            });
        } catch (err) {
          console.log(err);
        }
      }
    
      
      async getMovimentos(filter) {
        try {
          var result = [];
    
          result = await knex
            .select(["m.id_movimento","m.quantidade","p.nome as produto", "l.lote as lote","u.nome as unidade","o.nome as origem"])
            .column(knex.raw("TO_CHAR(m.dt_movimento, 'DD/MM/YYYY') as data"))
            .column(knex.raw("(CASE m.tipo when 1 then 'Entrada' when 2 then 'Devolução'when 3 then 'Repasse' when 4 then 'Consumo' when 5 then 'Transferência' else 'Recolhimento' end) as tipo"))
            .table("movimento as m")
            .join("unidade as u","u.id_unidade","=","m.id_unidade")
            .join("unidade as o","o.id_unidade","=","m.or_dest")
            .join("lote as l","l.id_lote","=","m.id_lote")
            .join("produto as p","l.id_produto","=","p.id_produto")
            .unionAll([
              knex
            .select(["m.id_movimento","m.quantidade","p.nome as produto", "l.lote as lote","u.nome as unidade","o.nome as origem"])
            .column(knex.raw("TO_CHAR(m.dt_movimento, 'DD/MM/YYYY') as data"))
            .column(knex.raw("(CASE m.tipo when 1 then 'Entrada' when 2 then 'Devolução'when 3 then 'Repasse' when 4 then 'Consumo' when 5 then 'Transferência' else 'Recolhimento' end) as tipo"))
            .table("movimento as m")
            .join("unidade as u","u.id_unidade","=","m.id_unidade")
            .join("municipio as o","o.id_municipio","=","m.or_dest")
            .join("lote as l","l.id_lote","=","m.id_lote")
            .join("produto as p","l.id_produto","=","p.id_produto")
            .orderBy("id_movimento", "desc")
            ]);
            
    
          return result;
        } catch (err) {
          console.log(err);
          return [];
        }
      }
    
      
      async getMovimento(id) {
        try {
          var result = [];
    
          result = await knex
            .select("u.*")
            .table("movimento as u")
            .where("id_movimento", "=", id);

          return result[0];
        } catch (err) {
          console.log(err);
          return [];
        }
      }
    
      async delete(id) {
        try {
          await knex.delete().where({ id_movimento: id }).table("movimento");
          return { status: true };
        } catch (err) {
          return { status: false, err: err };
        }
      }

}

module.exports = new Movimento();