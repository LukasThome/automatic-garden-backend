const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const cors = require('cors');





const app = express();

app.use(cors()); // Adicione esta linha para habilitar o CORS

app.use(bodyParser.json());

// Conexão com o banco de dados SQLite3
const db = new sqlite3.Database("leituras.db");

// Criação da tabela se não existir
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS leituras (id INTEGER PRIMARY KEY AUTOINCREMENT, valor INTEGER, timestamp TEXT)");
});

// Método para inserir leituras no banco de dados
function inserirLeitura(valor) {
  const timestamp = new Date().toISOString();
  db.run("INSERT INTO leituras (valor, timestamp) VALUES (?, ?)", [valor, timestamp]);
}

// Rota para lidar com requisições POST do Arduino
app.post("/receber-leitura", (req, res) => {
  try {
    const leitura = req.body;

    // Insere a leitura no banco de dados
    inserirLeitura(leitura.valor);

    // Retorna uma resposta de sucesso
    res.status(200).json({ mensagem: "Leitura recebida e salva com sucesso." });
  } catch (error) {
    console.error("Erro ao processar requisição POST:", error);
    res.status(500).json({ erro: "Erro interno do servidor." });
  }
});

// Rota para fornecer leituras para o aplicativo móvel
app.get("/obter-leituras", (req, res) => {
  try {
    // Obtém todas as leituras da tabela
    db.all("SELECT * FROM leituras", (err, rows) => {
      if (err) {
        console.error("Erro ao obter leituras:", err);
        res.status(500).json({ erro: "Erro interno do servidor." });
      } else {
        // Retorna as leituras no corpo da resposta
        res.status(200).json({ leituras: rows });
      }
    });
  } catch (error) {
    console.error("Erro ao processar requisição GET:", error);
    res.status(500).json({ erro: "Erro interno do servidor." });
  }
});

// Inicia o servidor na porta 8090
let porta = 8090;
app.listen(porta, () => {
  console.log("Servidor em execução na porta: " + porta);
});
