var knex = require("../database/connection");
const errorCode = require("../database/ErrorCode");

class Pedido{
    //id_pedido, id_programa, id_produto, justifica, quant_sol, quant_lib, id_users, id_sisaweb, id_municipio, 
    //est_montada, est_portatil, est_pulverizador, est_imoveis, est_casos, est_pendencia, dt_libera, created_at, updated_at, est_consumo

    async create(dados) {
        try {
          var { id_programa, id_produto, justifica, quant_sol, id_sisaweb, id_municipio, est_montada, est_portatil, est_pulverizador, est_imoveis, est_casos, est_pendencia, est_consumo } = dados;
    
          var currentdate = new Date(); 
          var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth()+1)  + "-" + currentdate.getDate() + " "
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
          
          var created_at = datetime;
          var updated_at = datetime;

          const result = await knex
            .insert({
                id_programa, id_produto, justifica, quant_sol, id_sisaweb, id_municipio, est_montada, est_portatil, est_pulverizador, est_imoveis, est_casos, est_pendencia, created_at, updated_at, est_consumo
            })
            .table("pedido");
    
          return { status: true, err: null};
        } catch (err) {
            var msg = errorCode.getPgError(err.code);
            return {status: false, err: msg};
        }
      }
    
      async update(dados) {
        try {
          var {
            id_pedido, id_users, quant_lib, dt_libera
          } = dados;

          var currentdate = new Date(); 
          var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth()+1)  + "-" + currentdate.getDate() + " "
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
          
          var updated_at = datetime;
    
          await knex("pedido")
            .where("id_pedido", id_pedido)
            .update({
                id_users, quant_lib, dt_libera, updated_at
            });

          return { status: true, err: null};
        } catch (err) {
            var msg = errorCode.getPgError(err.code);
            return {status: false, err: msg};
        }
      }
    
      async getPedidosSw(mun) {
        try {
          var result = [];
    
          result = await knex
            .select(["p.*","m.nome as municipio","d.nome as produto"])
            .column(knex.raw("CASE when quant_lib is null then '' else u.nome end as resp"))
            .column(knex.raw("TO_CHAR(p.created_at, 'DD/MM/YYYY') as dt_pedido"))
            .column(knex.raw("TO_CHAR(p.dt_libera, 'DD/MM/YYYY') as dt_libera"))
            .column(knex.raw("Case when quant_lib is null then 'Aberto' else 'Atendido' end as status"))
            .table("pedido as p")
            .join("municipio as m","m.id_municipio","=","p.id_municipio")
            .join("produto as d","d.id_produto","=","p.id_produto")
            .leftJoin("users as u", "u.id_users", "=", "p.id_users")
            .where("p.id_municipio","=",mun)
            .orderBy("id_pedido", "desc");
    
          return result;
        } catch (err) {
          console.log(err);
          return [];
        }
      }
      
      async getPedidos() {
        try {
          var result = [];
    
          result = await knex
            .select(["p.*","m.nome as municipio","d.nome as produto"])
            .column(knex.raw("CASE when quant_lib is null then '' else u.nome end as resp"))
            .column(knex.raw("TO_CHAR(p.created_at, 'DD/MM/YYYY') as dt_pedido"))
            .column(knex.raw("TO_CHAR(p.dt_libera, 'DD/MM/YYYY') as dt_libera"))
            .column(knex.raw("Case when quant_lib is null then 'Aberto' else 'Atendido' end as status"))
            .table("pedido as p")
            .join("municipio as m","m.id_municipio","=","p.id_municipio")
            .join("produto as d","d.id_produto","=","p.id_produto")
            .leftJoin("users as u", "u.id_users", "=", "p.id_users")
            .orderBy("id_pedido", "desc");
    
          return result;
        } catch (err) {
          console.log(err);
          return [];
        }
      }
    
      
      async getPedido(id) {
        try {
          var result = [];
    
          result = await knex
            .select("u.*")
            .table("pedido as u")
            .where("id_pedido", "=", id);

          return result[0];
        } catch (err) {
          console.log(err);
          return [];
        }
      }
    
      async delete(id) {
        try {
          await knex.delete().where({ id_pedido: id }).table("pedido");
          return { status: true };
        } catch (err) {
          return { status: false, err: err };
        }
      }
}

module.exports = new Pedido();