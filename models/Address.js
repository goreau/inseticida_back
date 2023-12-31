var knex = require("../database/connection");
const errorCode = require("../database/ErrorCode");
const Unidade = require("./Unidade");

class Address{
    //id_address, id_unidade, logradouro, numero, complemento, bairro, cidade, cep, created_at, updated_at, 
    //ddd, telefone, id_users
	
    async create(dados) {
        try {
          var { id_unidade, logradouro, numero, complemento, bairro, cep, ddd, telefone, id_users } = dados;
    
          var currentdate = new Date(); 
          var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth()+1)  + "-" + currentdate.getDate() + " "
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
          
          var created_at = datetime;
          var updated_at = datetime;

          var unid = await Unidade.getUnidade(id_unidade);
          var cidade = unid.nome;

          const result = await knex
            .insert({
                id_unidade, logradouro, numero, complemento, bairro, cidade, cep, created_at, updated_at, ddd, telefone, id_users
            })
            .table("address");
    
            return { status: true, err: null};
          } catch (err) {
            var msg = errorCode.getPgError(err.code);
            return {status: false, err: msg};
          }
      }
    
      async update(dados) {
        try {
          var {
            id_address, id_unidade, logradouro, numero, complemento, bairro, 
            cep, updated_at, ddd, telefone, id_users
          } = dados;

          var currentdate = new Date(); 
          var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth()+1)  + "-" + currentdate.getDate() + " "
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
          
          var updated_at = datetime;

          var unid = await Unidade.getUnidade(id_unidade);
          var cidade = unid.nome;
    
          await knex("address")
            .where("id_address", id_address)
            .update({
                id_unidade, logradouro, numero, complemento, bairro, cidade, cep, updated_at, ddd, telefone, id_users
            });
            
          return { status: true, err: null};
        } catch (err) {
            var msg = errorCode.getPgError(err.code);
            return {status: false, err: msg};
        }
      }

      
      async getAddresss() {
        try {
          var result = [];
    
          result = await knex
            .select(["p.id_address","p.bairro", "p.id_users"])
            .column(knex.raw("CONCAT(m.codigo, '.', m.nome) as unidade"))
            .column(knex.raw("CONCAT(p.logradouro, ', ', p.numero) as endereco"))
            .column(knex.raw("TO_CHAR(p.updated_at, 'DD/MM/YYYY') as atualiz"))
            .table("address as p")
            .join("unidade as m","m.id_unidade","=","p.id_unidade")
            .orderBy("id_address", "desc");
    
          return result;
        } catch (err) {
          console.log(err);
          return [];
        }
      }

      async getAddressRecibo(unid) {
        try {
          var result = [];
          console.log(unid);
 
          result = await knex
            .select(["p.id_address","p.bairro", "p.cidade"])
            .column(knex.raw("CONCAT(m.codigo, '.', m.nome) as unidade"))
            .column(knex.raw("CONCAT(p.logradouro, ', ', p.numero) as endereco"))
            .table("address as p")
            .join("unidade as m","m.id_unidade","=","p.id_unidade")
            .where("p.id_unidade", "=", unid)
            .orderBy("id_address", 'desc')
            .first();

          return result;
        } catch (err) {
          console.log(err);
          return [];
        }
      }
    
      
      async getAddress(id) {
        try {
          var result = [];
    
          result = await knex
            .select("u.*")
            .table("address as u")
            .where("id_address", "=", id);

          return result[0];
        } catch (err) {
          console.log(err);
          return [];
        }
      }
    
      async delete(id) {
        try {
          await knex.delete().where({ id_address: id }).table("address");
          return { status: true };
        } catch (err) {
          return { status: false, err: err };
        }
      }
}

module.exports = new Address();