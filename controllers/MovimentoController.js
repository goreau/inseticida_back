require('dotenv').config();
var Movimento = require("../models/Movimento");

class MovimentoController{
    async createMovimento(req, res) {
        try {
          var dados = req.body;
          var result = await Movimento.create(dados);
          if(result.status){
            res.status(200);
            res.json({ msg: "Movimento cadastrado!"});
          }
          else 
          {
            res.status(400).json({msg: result.err});
          }
        } catch (error) {
          res.status(400).send(error);
        }
      }
    
      async getMovimento(req, res) {
        var id = req.params.id;
        var locs = await Movimento.getMovimento(id);
        res.json(locs);
      }
    
      async updateMovimento(req, res) {
        try {
          var dados = req.body;
          var result = await Movimento.update(dados);
          res.status(200);
          res.json({ msg: "Movimento alterado!" });
        } catch (error) {
          res.status(400).send(error);
        }
      }
    
      async getMovimentos(req, res) {
        var filter = req.params.mun;
        var locs = await Movimento.getMovimentos(filter);
        res.json(locs);
      }
      
      async deleteMovimento(req, res) {
        var id = req.params.id;
        var result = await Movimento.delete(id);
        res.status(200);
        res.json({ msg: "Movimento excluído!" });
      }

}

module.exports = new MovimentoController();