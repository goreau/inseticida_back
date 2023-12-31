
class ErrorCode {
  getPgError(code) {
    var err = '';
    switch (code) {
      case '00000':
        err = 'Conclusão bem-sucedida';
        break;

      case '01000':
        err = 'Aviso';
        break;

      case '0100C':
        err = 'Conjunto de resultados dinâmicos retornados';
        break;

      case '01008':
        err = 'Preenchimento implícito de bit zero';
        break;

      case '01003':
        err = 'Valor nulo eliminado na função de conjunto';
        break;

      case '01007':
        err = 'Privilégio não concedido';
        break;

      case '01006':
        err = 'Privilégio não revogado';
        break;

      case '01004':
        err = 'Truncamento de dados de string à direita';
        break;

      case '01P01':
        err = 'Recurso obsoleto';
        break;

      case '02000':
        err = 'Sem dados';
        break;

      case '02001':
        err = 'Nenhum conjunto de resultados dinâmicos adicionais retornados';
        break;

      case '03000':
        err = 'Declaração SQL ainda não concluída';
        break;

      case '08000':
        err = 'Exceção de conexão';
        break;

      case '08001':
        err = 'Cliente incapaz de estabelecer conexão';
        break;

      case '08003':
        err = 'Conexão não existe';
        break;

      case '08004':
        err = 'Servidor rejeitou a conexão';
        break;

      case '08006':
        err = 'Falha na conexão';
        break;

      case '08007':
        err = 'Resolução de transação desconhecida';
        break;

      case '08P01':
        err = 'Violação de protocolo';
        break;

      case '09000':
        err = 'Exceção de ação acionada';
        break;

      case '0A000':
        err = 'Recurso não suportado';
        break;

      case '0B000':
        err = 'Inicialização de transação inválida';
        break;

      case '0F000':
        err = 'Exceção de localizador';
        break;

      case '0F001':
        err = 'Especificação de localizador inválida';
        break;

      case '0L000':
        err = 'Concedente inválido';
        break;

      case '0LP01':
        err = 'Operação de concessão inválida';
        break;

      case '0P000':
        err = 'Especificação de função inválida';
        break;

      case '21000':
        err = 'Violação de cardinalidade';
        break;

      case '22000':
        err = 'Exceção de dados';
        break;

      case '22001':
        err = 'Truncamento de dados de string à direita';
        break;

      case '22002':
        err = 'Estouro de indicador';
        break;

      case '22003':
        err = 'Valor numérico fora do intervalo';
        break;

      case '22004':
        err = 'Valor nulo não permitido';
        break;

      case '22005':
        err = 'Erro na atribuição';
        break;

      case '22007':
        err = 'Formato de data e hora inválido';
        break;

      case '22008':
        err = 'Estouro de campo de data e hora';
        break;

      case '22009':
        err = 'Valor de deslocamento de fuso horário inválido';
        break;

      case '2200B':
        err = 'Conflito de caractere de escape';
        break;

      case '2200C':
        err = 'Uso inválido de caractere de escape';
        break;

      case '2200D':
        err = 'Octeto de escape inválido';
        break;

      case '2200F':
        err = 'Sequência de caracteres de comprimento zero';
        break;

      case '2200G':
        err = 'Incompatibilidade de tipo mais específico';
        break;

      case '22010':
        err = 'Valor de parâmetro de indicador inválido';
        break;

      case '22011':
        err = 'Erro de substring';
        break;

      case '22012':
        err = 'Divisão por zero';
        break;

      case '22013':
        err = 'Tamanho anterior ou posterior inválido';
        break;

      case '22014':
        err = 'Argumento inválido para a função NTILE';
        break;

      case '22015':
        err = 'Estouro de campo de intervalo';
        break;

      case '22016':
        err = 'Argumento inválido para a função de janela';
        break;

      case '22018':
        err = 'Valor de caractere inválido para conversão';
        break;

      case '22019':
        err = 'Caractere de escape inválido';
        break;

      case '2201B':
        err = 'Expressão regular inválida';
        break;

      case '2201E':
        err = 'Argumento inválido para o logaritmo';
        break;

      case '2201F':
        err = 'Argumento inválido para a função de potência';
        break;

      case '2201G':
        err = 'Argumento inválido para a função de bucket de largura';
        break;

      case '2201W':
        err = 'Contagem de linhas inválida na cláusula Limit';
        break;

      case '2201X':
        err = 'Valor de argumento de contagem inválido';
        break;

      case '22020':
        err = 'Valor de limite inválido';
        break;

      case '22021':
        err = 'Caractere não no repertório';
        break;

      case '22022':
        err = 'Estouro de indicador';
        break;

      case '22023':
        err = 'Valor de parâmetro inválido';
        break;

      case '22024':
        err = 'Cadeia de caracteres C não terminada';
        break;

      case '22025':
        err = 'Sequência de escape inválida';
        break;

      case '22026':
        err = 'Incompatibilidade de comprimento de dados de string';
        break;

      case '22027':
        err = 'Erro de corte';
        break;

      case '2202E':
        err = 'Erro de subscrito de matriz';
        break;

      case '2202F':
        err = 'Erro de elemento de matriz';
        break;

      case '2202G':
        err = 'Erro de dados de matriz';
        break;

      case '22030':
        err = 'Expressão regular inválida';
        break;

      case '22031':
        err = 'Valor binário inválido para conversão';
        break;

      case '22032':
        err = 'Representação binária inválida';
        break;
      case '22P02':
          err = 'Valor inválido para o campo';
          break;
      case '23502':
          err = 'Valor obrigatório não informado';
          break;
      case '23505':
          err = 'Login já existe!';
          break;
      case '42883':
          err = 'Função não encontrada.';
          break;
      default:
        err = "Erro executando a solicitação! Erro: " + code;
        break;
    }
    return err;
  }
}

module.exports = new ErrorCode();