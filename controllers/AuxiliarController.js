require('dotenv').config();
var Unidade = require("../models/Unidade");
var Natureza = require("../models/Natureza");
class AuxiliarController{
    async createUnidade(req, res) {
        try {
          var dados = req.body;
          var result = await Unidade.create(dados);
          res.status(200);
          res.json({ msg: "Unidade cadastrada!" });
        } catch (error) {
          res.status(400).send(error);
        }
      }
    
      async getUnidade(req, res) {
        var id = req.params.id;
        var locs = await Unidade.getUnidade(id);
        res.json(locs);
      }
    
      async updateUnidade(req, res) {
        try {
          var dados = req.body;
          var result = await Unidade.update(dados);
          res.status(200);
          res.json({ msg: "Unidade alterada!" });
        } catch (error) {
          res.status(400).send(error);
        }
      }
    
      async getUnidades(req, res) {
        var filter = req.params.mun;
        var locs = await Unidade.getUnidades(filter);
        res.json(locs);
      }
      
      async deleteUnidade(req, res) {
        var id = req.params.id;
        var result = await Unidade.delete(id);
        res.status(200);
        res.json({ msg: "Unidade excluída!" });
      }

    async getUnidadesCombo(req, res){
        //  var id = req.params.id;
          var users = await Unidade.getUnidadesCombo();
          if(users == undefined){
              res.status(404);
              res.json({});
          }else{
              res.status(200)
              res.json(users);
          }
      }

      /*========================*/

      async createNatureza(req, res) {
        try {
          var dados = req.body;
          var result = await Natureza.create(dados);
          res.status(200);
          res.json({ msg: "Unidade cadastrada!" });
        } catch (error) {
          res.status(400).send(error);
        }
      }
    
      async getNatureza(req, res) {
        var id = req.params.id;
        var locs = await Natureza.getNatureza(id);
        res.json(locs);
      }
    
      async updateNatureza(req, res) {
        try {
          var dados = req.body;
          var result = await Natureza.update(dados);
          res.status(200);
          res.json({ msg: "Natureza alterada!" });
        } catch (error) {
          res.status(400).send(error);
        }
      }
    
      async getNaturezas(req, res) {
        var filter = req.params.mun;
        var locs = await Natureza.getNaturezas(filter);
        res.json(locs);
      }
      
      async deleteNatureza(req, res) {
        var id = req.params.id;
        var result = await Natureza.delete(id);
        res.status(200);
        res.json({ msg: "Unidade excluída!" });
      }

    async getNaturezasCombo(req, res){
        //  var id = req.params.id;
          var users = await Natureza.getNaturezasCombo();
          if(users == undefined){
              res.status(404);
              res.json({});
          }else{
              res.status(200)
              res.json(users);
          }
      }
  
}

module.exports = new AuxiliarController();