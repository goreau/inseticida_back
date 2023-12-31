var Relatorio = require("../models/Relatorio");


class RelatorioController{
    async getRelat(req, res){
      var id = req.params.id;
      var filter = req.body;
    

      var regs = [];

      switch (id) {
        case '1':
          regs = await Relatorio.getRepasseProduto(filter);
          break;
        case '2':
          regs = await Relatorio.getSaldo(filter);
          break;
        case '3':
          regs = await Relatorio.getResumo(filter);
          break;
        case '4':
          regs = await Relatorio.getResumoTipo(filter);
          break;
        case '5':
          regs = await Relatorio.getSaldoProd(filter);
          break;
        case '6':
          regs = await Relatorio.getResumoRep(filter);
          break;
        case '7':
          regs = await Relatorio.getTransf(filter);
          break;
        case '8':
          regs = await Relatorio.getRepCons(filter);
          break;
        default:
          regs = [];
          break;
      }

      var filtro = Relatorio.strFilter;
      var filt = filtro.length > 0 ? 'Filtros: ' +  filtro.join(', ') : '';
      var ret = {data: regs, filter: filt};

      res.json(ret);
    }

    async getExport(req, res){
      var id = req.params.id;
      var filter = req.body;

      var regs = [];

      switch (id) {
        case '1':
          regs = await Relatorio.getCapturaExp(filter);
          break;
        case '2':
          regs = await Relatorio.getIdentificacaoExp(filter);
          break;
        default:
          regs = [];
          break;
      }

      
      res.json(regs);
    }
    
}

module.exports = new RelatorioController();