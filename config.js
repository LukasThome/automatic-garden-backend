const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const app = express();
app.use(bodyParser.json());
const fs = require("fs");  


// Body Parser - usado para processar dados da requisição HTTP
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Método HTTP GET /hello - envia a mensagem: Hello World
app.get('/hello', (req, res) => {
 res.send('Hello World');
});


// Rota para lidar com requisições PATCH
app.patch("/Config/atualizar-temperatura", (req, res) => {
  try {
    // Lê o arquivo JSON de configuração
    const configFile = "config.json";
    const configData = fs.readFileSync(configFile, "utf8");
    const config = JSON.parse(configData);

    // Atualiza o parâmetro de temperatura com base nos dados recebidos na requisição PATCH
    if (req.body.temperatura) {
      config.temperatura = req.body.temperatura;
    }

    // Escreve as alterações de volta no arquivo JSON
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));

    // Retorna a resposta de sucesso
    res.status(200).json({ mensagem: "Parâmetro de temperatura atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao processar requisição PATCH:", error);
    res.status(500).json({ erro: "Erro interno do servidor." });
  }
});


// Rota para lidar com requisições GET da temperatura
app.get("/Config/ler-temperatura", (req, res) => {
    try {
      // Lê o arquivo JSON de configuração
      const configFile = "config.json";
      const configData = fs.readFileSync(configFile, "utf8");
      const config = JSON.parse(configData);
  
      // Retorna a temperatura no corpo da resposta
      res.status(200).json({ temperatura: config.temperatura });
    } catch (error) {
      console.error("Erro ao processar requisição GET:", error);
      res.status(500).json({ erro: "Erro interno do servidor." });
    }
  });


// Inicia o Servidor na porta 8080
let porta = 8080;
app.listen(porta, () => {
 console.log('Servidor em execução na porta: ' + porta);
});