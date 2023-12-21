require('dotenv').config();
var Lote = require("../models/Lote");

class LoteController{
    async createLote(req, res) {
        try {
          var dados = req.body;
          var result = await Lote.create(dados);
          res.status(200);
          res.json({ msg: "Lote cadastrado!" });
        } catch (error) {
          res.status(400).send(error);
        }
      }
    
      async getLote(req, res) {
        var id = req.params.id;
        var locs = await Lote.getLote(id);
        res.json(locs);
      }
    
      async updateLote(req, res) {
        try {
          var dados = req.body;
          var result = await Lote.update(dados);
          res.status(200);
          res.json({ msg: "Lote alterado!" });
        } catch (error) {
          res.status(400).send(error);
        }
      }
    
      async getLotes(req, res) {
        var filter = req.params.mun;
        var locs = await Lote.getLotes(filter);
        res.json(locs);
      }
      
      async deleteLote(req, res) {
        var id = req.params.id;
        var result = await Lote.delete(id);
        res.status(200);
        res.json({ msg: "Lote excluído!" });
      }

    async getLotesCombo(req, res){
        //  var id = req.params.id;
          var users = await Lote.getLotesCombo();
          if(users == undefined){
              res.status(404);
              res.json({});
          }else{
              res.status(200)
              res.json(users);
          }
      }
}

module.exports = new LoteController();