require('dotenv').config();
var Address = require("../models/Address");

class AddressController{
    async createAddress(req, res) {
        try {
          var dados = req.body;
          var result = await Address.create(dados);
          if(result.status){
            res.status(200);
            res.json({ msg: "Endereço cadastrado!"});
          }
          else 
          {
            res.status(400).json({msg: result.err});
          }
        } catch (error) {
          res.status(400).send(error);
        }
      }
    
      async getAddress(req, res) {
        var id = req.params.id;
        var locs = await Address.getAddress(id);
        res.json(locs);
      }
    
      async updateAddress(req, res) {
        try {
          var dados = req.body;
          var result = await Address.update(dados);
          if(result.status){
            res.status(200);
            res.json({ msg: "Endereço alterado!"});
          }
          else 
          {
            res.status(400).json({msg: result.err});
          }
        } catch (error) {
          res.status(400).send(error);
        }
      }

      async getAddresss(req, res) {
        var filter = req.params.filter;
        var locs = await Address.getAddresss(filter.municipio);
        res.json(locs);
      }

      async getAddressRecibo(req, res) {
        var unid = req.params.unid;
        var locs = await Address.getAddressRecibo(unid);
        res.json(locs);
      }
      
      async deleteAddress(req, res) {
        var id = req.params.id;
        var result = await Address.delete(id);
        res.status(200);
        res.json({ msg: "Endereço excluído!" });
      }
}

module.exports = new AddressController();