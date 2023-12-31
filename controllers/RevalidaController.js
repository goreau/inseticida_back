require('dotenv').config();
var Revalida = require("../models/Revalida");

class RevalidaController{
    async createRevalida(req, res) {
        try {
          var dados = req.body;
          var result = await Revalida.create(dados);
          if(result.status){
            res.status(200);
            res.json({ msg: "Revalidação cadastrada!"});
          }
          else 
          {
            res.status(400).json({msg: result.err});
          }
        } catch (error) {
          res.status(400).send(error);
        }
      }
    
      async getRevalida(req, res) {
        var id = req.params.id;
        var locs = await Revalida.getRevalida(id);
        res.json(locs);
      }
    
      async updateRevalida(req, res) {
        try {
          var dados = req.body;
          var result = await Revalida.update(dados);
          if(result.status){
            res.status(200);
            res.json({ msg: "Revalidação alterada!"});
          }
          else 
          {
            res.status(400).json({msg: result.err});
          }
        } catch (error) {
          res.status(400).send(error);
        }
      }
    
      async getRevalidas(req, res) {
        var filter = req.params.mun;
        var locs = await Revalida.getRevalidas(filter);
        res.json(locs);
      }
      
      async deleteRevalida(req, res) {
        var id = req.params.id;
        var result = await Revalida.delete(id);
        res.status(200);
        res.json({ msg: "Revalidação excluída!" });
      }

    async getRevalidasCombo(req, res){
        //  var id = req.params.id;
          var users = await Revalida.getRevalidasCombo();
          if(users == undefined){
              res.status(404);
              res.json({});
          }else{
              res.status(200)
              res.json(users);
          }
      }
}

module.exports = new RevalidaController();