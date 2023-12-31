var knex = require("../database/connection");
const moment = require("moment");

class Relatorio {
  strFilter = [];

  async getRepasseProduto(filter) {
    try {
      var filtros = await this.createFilter(filter, true, 1);

      var result = knex
        .table("movimento as b")
        .join("unidade as u", "b.id_unidade", "=", "u.id_unidade")
        .join("municipio as m", "m.id_municipio", "=", "b.or_dest")
        .join("lote as lt", "lt.id_lote", "=", "b.id_lote")
        .join("produto as p", "lt.id_produto", "=", "p.id_produto")
        .leftJoin("revalida as r", "lt.id_lote", "=", "r.id_lote")
        .select(
          knex.raw("concat(u.codigo, ' - ', u.nome) as local"),
          "m.nome as municipio",
          "p.nome as produto",
          "b.id_unidade",
          "lt.lote as lote",
          knex.raw("to_char(b.dt_movimento, 'DD/MM/YYYY') as data"),
          "b.quantidade as qtd",
          knex.raw(
            "(case p.unidade::int when 1 then 'Kg' when 2 then 'Litro' else 'Unid' end) as unidade"
          ),
          knex.raw(
            "to_char(coalesce(r.dt_validade,lt.dt_validade), 'DD/MM/YYYY') as validade"
          ),
          knex.raw("b.id_movimento as recibo")
        )
        .where("b.tipo", "=", "3")
        // .orderBy('u.nome, m.nome, p.nome')
        .modify(function (queryBuilder) {
          filtros.forEach((el) => {
            queryBuilder.where(el.field, el.operator, el.value);
          });
        });

      return result;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async getSaldo(filter) {
    try {
      var filtros = await this.createFilter(filter, true, 2);

      var result = await knex
        .table("saldo as b")
        .join("unidade as u", "b.id_unidade", "=", "u.id_unidade")
        .join("lote as lt", "lt.id_lote", "=", "b.id_lote")
        .join("produto as p", "lt.id_produto", "=", "p.id_produto")
        .select(
          knex.raw("concat(u.codigo, ' - ', u.nome) as local"),
          "p.nome as produto",
          "lt.lote as lote",
          "b.qt_saldo as qtd",
          knex.raw(
            "(case p.unidade::int when 1 then 'Kg' when 2 then 'Litro' else 'Unid' end) as unidade"
          )
        )
        .orderBy("u.nome")
        .orderBy("p.nome")
        .modify(function (queryBuilder) {
          filtros.forEach((el) => {
            queryBuilder.where(el.field, el.operator, el.value);
          });
        });

      return result;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async getResumo(filter) {
    try {
      var filtros = await this.createFilter(filter, false, 3);

      var result = await knex
        .table("movimento as b")
        .join("unidade as u", "b.id_unidade", "=", "u.id_unidade")
        .join("lote as lt", "lt.id_lote", "=", "b.id_lote")
        .join("produto as p", "lt.id_produto", "=", "p.id_produto")
        .join("saldo as s", function () {
          this.on("s.id_lote", "=", "b.id_lote").on(
            "s.id_unidade",
            "=",
            "b.id_unidade"
          );
        })
        .leftJoin("revalida as r", "lt.id_lote", "=", "r.id_lote")
        .select(
          "p.nome as produto",
          "lt.lote as lote",
          knex.raw(
            "to_char(max(coalesce(r.dt_validade,lt.dt_validade)), 'DD-MM-YYYY') as validade"
          ),
          knex.raw(
            "sum(case b.tipo when 1 then b.quantidade else 0 end) as entrada"
          ),
          knex.raw(
            "sum(case b.tipo when 2 then b.quantidade else 0 end) as devolucao"
          ),
          knex.raw(
            "sum(case b.tipo when 3 then b.quantidade else 0 end) as repasse"
          ),
          knex.raw(
            "sum(case b.tipo when 4 then b.quantidade else 0 end) as consumo"
          ),
          knex.raw(
            "sum(case b.tipo when 5 then b.quantidade else 0 end) as transfer"
          ),
          knex.raw(
            "sum(case b.tipo when 9 then b.quantidade else 0 end) as descarte"
          ),
          "s.qt_saldo as saldo"
        )
        .orderBy("p.nome")
        .groupByRaw("p.nome, lt.lote, s.qt_saldo")
        .modify(function (queryBuilder) {
          filtros.forEach((el) => {
            queryBuilder.where(el.field, el.operator, el.value);
          });
        });

      return result;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async getResumoTipo(filter) {
    var filtros = await this.createFilter(filter, false, 4);

    var result = await knex.table("movimento as b")
      .join("unidade as u", "b.id_unidade", "=", "u.id_unidade")
      .leftJoin("unidade as uu", "uu.id_unidade", "=", "b.or_dest")
      .leftJoin("municipio as m", "m.id_municipio", "=", "b.or_dest")
      .join("lote as lt", "lt.id_lote", "=", "b.id_lote")
      .join("produto as p", "lt.id_produto", "=", "p.id_produto")
      .leftJoin("revalida as r", "lt.id_lote", "=", "r.id_lote")
      .select(
        knex.raw(
          "(case b.tipo when 1 then 'Entrada' when 2 then 'Devolucao' when 3 then 'Repasse' when 4 then 'Consumo' when 5 then 'Transfer' else 'Descarte' end) as tipo"
        ),
        knex.raw("concat(u.codigo, ' - ', u.nome) as local"),
        "p.nome as produto",
        "lt.lote as lote",
        "b.quantidade as qtd",
        knex.raw(
          "(case p.unidade::int when 1 then 'Kg' when 2 then 'Litro' else 'Unid' end) as unidade"
        ),
        knex.raw(
          '(case when (b.tipo=1 or b.tipo=5 or b.tipo=9) then uu.nome else m.nome end) as "or dest"'
        )
      )
      .orderBy("u.nome")
      .orderBy("m.nome")
      .orderBy("p.nome")
      .modify(function (queryBuilder) {
        filtros.forEach((el) => {
          queryBuilder.where(el.field, el.operator, el.value);
        });
      });

    return result;
  }

  async getSaldoProd(filter) {
    var filtros = await this.createFilter(filter, false, 5);

    var result = await knex.table('saldo as b')
    .join('unidade as u', 'b.id_unidade', '=', 'u.id_unidade')
    .join('lote as lt',  'lt.id_lote', '=', 'b.id_lote')
    .join('produto as p',  'lt.id_produto', '=', 'p.id_produto')
    .leftJoin('revalida as r',  'lt.id_lote', '=', 'r.id_lote')
    .select(
        'p.nome as produto',
        'lt.lote as lote',
        knex.raw('to_char(coalesce(r.dt_validade,lt.dt_validade), \'DD-MM-YYYY\') as validade'),
        knex.raw("concat(u.codigo, ' - ', u.nome) as local"),
        'b.qt_saldo as saldo',
        knex.raw('(case p.unidade::int when 1 then \'Kg\' when 2 then \'Litro\' else \'Unid\' end) as unidade'),
    )
    .where('b.qt_saldo', '>', '0')
    .orderBy('p.nome')
    .orderBy('lt.lote')
    .modify(function (queryBuilder) {
      filtros.forEach((el) => {
        queryBuilder.where(el.field, el.operator, el.value);
      });
    });

    return result;
  }

    async getResumoRep(filter) {
      var filtros = await this.createFilter(filter, false, 6);
  
      var result = await knex.table('movimento as b')
      .join('lote as lt',  'lt.id_lote', '=', 'b.id_lote')
      .join('produto as p',  'lt.id_produto', '=', 'p.id_produto')
      .join('municipio as m', 'm.id_municipio', '=', 'b.or_dest')
      .join('unidade as u', 'b.id_unidade', '=', 'u.id_unidade')
      .select(
          'm.nome as municipio',
          'p.nome as produto',
          knex.raw('sum(case when extract(month from b.dt_movimento)=1 then b.quantidade else 0 end) as jan'),
          knex.raw('sum(case when extract(month from b.dt_movimento)=2 then b.quantidade else 0 end) as fev'),
          knex.raw('sum(case when extract(month from b.dt_movimento)=3 then b.quantidade else 0 end) as mar'),
          knex.raw('sum(case when extract(month from b.dt_movimento)=4 then b.quantidade else 0 end) as abr'),
          knex.raw('sum(case when extract(month from b.dt_movimento)=5 then b.quantidade else 0 end) as mai'),
          knex.raw('sum(case when extract(month from b.dt_movimento)=6 then b.quantidade else 0 end) as jun'),
          knex.raw('sum(case when extract(month from b.dt_movimento)=7 then b.quantidade else 0 end) as jul'),
          knex.raw('sum(case when extract(month from b.dt_movimento)=8 then b.quantidade else 0 end) as ago'),
          knex.raw('sum(case when extract(month from b.dt_movimento)=9 then b.quantidade else 0 end) as set'),
          knex.raw('sum(case when extract(month from b.dt_movimento)=10 then b.quantidade else 0 end) as out'),
          knex.raw('sum(case when extract(month from b.dt_movimento)=11 then b.quantidade else 0 end) as nov'),
          knex.raw('sum(case when extract(month from b.dt_movimento)=12 then b.quantidade else 0 end) as dez')
      )
      .where('b.tipo', '=', '3')
      .orderBy('m.nome')
      .orderBy('p.nome')
      .groupByRaw('m.nome, p.nome')
      .modify(function (queryBuilder) {
        filtros.forEach((el) => {
          queryBuilder.where(el.field, el.operator, el.value);
        });
      });

      return result;
    }

      async getTransf(filter) {
        var filtros = await this.createFilter(filter, false, 7);
    
        var result = await knex.table('movimento as b')
        .join('lote as lt',  'lt.id_lote', '=', 'b.id_lote')
        .join('produto as p',  'lt.id_produto', '=', 'p.id_produto')
        .join('unidade as u', 'b.id_unidade', '=', 'u.id_unidade')
        .join('territorio as t', 't.id_territorio', '=', 'u.id_regional')
        .select(
            knex.raw("concat(t.regional,' - ',t.nome) as regional"),
            'p.nome as produto',
            knex.raw("extract(month from b.dt_movimento) as mes"),
            knex.raw("sum(quantidade) as qtd"),
        )
        .where('b.tipo', '=', 5)
        .orderBy('t.id_territorio')
        .orderBy('mes')
        .groupByRaw('t.regional, t.nome, p.nome, t.id_territorio, mes')
        .modify(function (queryBuilder) {
          filtros.forEach((el) => {
            queryBuilder.where(el.field, el.operator, el.value);
          });
        });

        return result;
      }

      async getRepCons(filter) {
        var filtros = await this.createFilter(filter, false, 8);
    
        var result = await knex.table('movimento as b')
        .join('lote as lt',  'lt.id_lote', '=', 'b.id_lote')
        .join('produto as p',  'lt.id_produto', '=', 'p.id_produto')
        .join('unidade as u', 'b.id_unidade', '=', 'u.id_unidade')
        .join('territorio as t', 't.id_territorio', '=', 'u.id_regional')
        .select(
            knex.raw("concat(t.regional,' - ',t.nome) as regional"),
            'p.nome as produto',
            knex.raw("extract(month from b.dt_movimento) as mes"),
            knex.raw("sum(case when b.tipo=3 then quantidade else 0 end) as repasse"),
            knex.raw("sum(case when b.tipo=4 then quantidade else 0 end) as consumo"),
        )
        .whereIn('b.tipo', [3, 4])
        .orderBy('t.id_territorio')
        .orderBy('mes')
        .groupByRaw('t.regional, t.nome, p.nome, t.id_territorio, mes')
        .modify(function (queryBuilder) {
          filtros.forEach((el) => {
            queryBuilder.where(el.field, el.operator, el.value);
          });
        });

        return result;
      }

 

  async createFilter(filter, isStr, tp) {
    var filtros = [];
    if (isStr) this.strFilter = [];

    if (filter.id_unidade && filter.id_unidade > 0) {
      filtros.push({
        field: "u.id_unidade",
        operator: "=",
        value: filter.id_unidade,
      });

      var unid = await knex("unidade")
        .where("id_unidade", filter.id_unidade)
        .first();

      if (isStr) this.strFilter.push("Unidade: " + unid.nome.trim());
    }

    if (filter.id_produto && filter.id_produto > 0) {
      filtros.push({
        field: "p.id_produto",
        operator: "=",
        value: filter.id_produto,
      });

      var prod = await knex("produto")
        .where("id_produto", filter.id_produto)
        .first();

      if (isStr) this.strFilter.push("Produto: " + prod.nome.trim());
    }

    if (filter.id_municipio && filter.id_municipio > 0 && tp == 1) {
      filtros.push({
        field: "m.id_municipio",
        operator: "=",
        value: filter.id_municipio,
      });

      var prod = await knex("municipio")
        .where("id_municipio", filter.id_municipio)
        .first();

      if (isStr) this.strFilter.push("Municipio: " + prod.nome.trim());
    }

    if (filter.tipo && filter.tipo > 0 && tp == 4) {
      filtros.push({
        field: "b.tipo",
        operator: "=",
        value: filter.tipo,
      });

      var strTipo = "";
      switch (filter.tipo) {
        case 1:
          strTipo = "Entrada";
          break;
        case 2:
          strTipo = "Devolução";
        case 3:
          strTipo = "Repasse";
        case 4:
          strTipo = "Consumo";
        case 5:
          strTipo = "Transferência";
        default:
          strTipo = "Descarte";
          break;
      }

      if (isStr) this.strFilter.push("Tipo: " + strTipo);
    }

    var dtarray = new Array(1, 3, 4, 6, 7, 8);
    if (dtarray.indexOf(tp) != -1) {
      if (filter.dt_inicio) {
        filtros.push({
          field: "b.dt_movimento",
          operator: ">=",
          value: filter.dt_inicio,
        });
        if (isStr)
          this.strFilter.push(
            "Data de Início >= " + this.formatDate(filter.dt_inicio)
          );
      }

      if (filter.dt_final) {
        filtros.push({
          field: "b.dt_movimento",
          operator: "<=",
          value: filter.dt_final,
        });
        if (isStr)
          this.strFilter.push(
            "Data de Término <= " + this.formatDate(filter.dt_final)
          );
      }
    }

    return filtros;
  }

  formatDate(date) {
    return moment(date).format("DD/MM/YYYY");
  }
}

module.exports = new Relatorio();
