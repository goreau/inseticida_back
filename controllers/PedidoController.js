require('dotenv').config();
var Pedido = require("../models/Pedido");

class PedidoController{
    async createPedido(req, res) {
        try {
          var dados = req.body;
          var result = await Pedido.create(dados);
          res.status(200);
          res.json({ msg: "Pedido cadastrado!" });
        } catch (error) {
          res.status(400).send(error);
        }
      }
    
      async getPedido(req, res) {
        var id = req.params.id;
        var locs = await Pedido.getPedido(id);
        res.json(locs);
      }
    
      async updatePedido(req, res) {
        try {
          var dados = req.body;
          var result = await Pedido.update(dados);
          res.status(200);
          res.json({ msg: "Pedido alterado!" });
        } catch (error) {
          res.status(400).send(error);
        }
      }
    
      async getPedidos(req, res) {
        var filter = req.params.mun;
        var locs = await Pedido.getPedidos(filter);
        res.json(locs);
      }
      
      async deletePedido(req, res) {
        var id = req.params.id;
        var result = await Pedido.delete(id);
        res.status(200);
        res.json({ msg: "Pedido excluído!" });
      }
}

module.exports = new PedidoController();