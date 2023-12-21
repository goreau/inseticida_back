require('dotenv').config();
var Produto = require("../models/Produto");

class ProdutoController{
    async createProduto(req, res) {
        try {
          var dados = req.body;
          var result = await Produto.create(dados);
          res.status(200);
          res.json({ msg: "Produto cadastrado!" });
        } catch (error) {
          res.status(400).send(error);
        }
      }
    
      async getProduto(req, res) {
        var id = req.params.id;
        var locs = await Produto.getProduto(id);
        res.json(locs);
      }
    
      async updateProduto(req, res) {
        try {
          var dados = req.body;
          var result = await Produto.update(dados);
          res.status(200);
          res.json({ msg: "Produto alterado!" });
        } catch (error) {
          res.status(400).send(error);
        }
      }
    
      async getProdutos(req, res) {
        var filter = req.params.mun;
        var locs = await Produto.getProdutos(filter);
        res.json(locs);
      }
      
      async deleteProduto(req, res) {
        var id = req.params.id;
        var result = await Produto.delete(id);
        res.status(200);
        res.json({ msg: "Produto excluído!" });
      }

    async getProdutosCombo(req, res){
        //  var id = req.params.id;
          var users = await Produto.getProdutosCombo();
          if(users == undefined){
              res.status(404);
              res.json({});
          }else{
              res.status(200)
              res.json(users);
          }
      }
}

module.exports = new ProdutoController();