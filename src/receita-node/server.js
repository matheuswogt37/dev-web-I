const express = require("express");
const https = require("https");
require("dotenv").config()

const app = express();
app.use(express.json());

// Database
const receitas = [
    {
        titulo: "Bolo de Chocolate",
        ingredientes: ["Farinha", "Açúcar", "Cacau em pó", "Ovos", "Manteiga"],
        instrucoes:
            "Misture todos os ingredientes e asse por 30 minutos a 180°C.",
        tempoPreparo: "45 minutos",
        tipoPrato: "Sobremesa",
    },
    {
        titulo: "Salada Caesar",
        ingredientes: ["Alface", "Croutons", "Queijo Parmesão", "Molho Caesar"],
        instrucoes: "Misture todos os ingredientes em uma tigela.",
        tempoPreparo: "15 minutos",
        tipoPrato: "Entrada",
    },
    {
        titulo: "Espaguete à Carbonara",
        ingredientes: ["Espaguete", "Bacon", "Ovos", "Queijo Pecorino"],
        instrucoes: "Cozinhe o espaguete e misture com os outros ingredientes.",
        tempoPreparo: "20 minutos",
        tipoPrato: "Prato Principal",
    },
    {
        titulo: "Sopa de Legumes",
        ingredientes: ["Cenoura", "Batata", "Cebola", "Caldo de legumes"],
        instrucoes: "Cozinhe todos os ingredientes até ficarem macios.",
        tempoPreparo: "30 minutos",
        tipoPrato: "Sopa",
    },
    {
        titulo: "Pudim de Leite",
        ingredientes: ["Leite condensado", "Leite", "Ovos", "Açúcar"],
        instrucoes: "Misture todos os ingredientes e asse em banho-maria.",
        tempoPreparo: "1 hora",
        tipoPrato: "Sobremesa",
    },
];

// Read
app.get("/", (req, res) => {
    if (null != req.query.ingrediente) {
        return res
            .status(200)
            .json(
                receitas.filter((rec) =>
                    rec.ingredientes.includes(req.query.ingrediente)
                )
            );
    }
    if (null != req.query.prato) {
        return res
            .status(200)
            .json(receitas.filter((rec) => rec.tipoPrato === req.query.prato));
    }
    res.json(receitas);
});

// Create
app.post("/novaReceita", (req, res) => {
    if (null == req.body.titulo) {
        return res.status(422).json({ message: "Falta o título" });
    }
    if (null == req.body.ingredientes) {
        return res.status(422).json({ message: "Falta os ingredientes" });
    }
    if (null == req.body.instrucoes) {
        return res.status(422).json({ message: "Falta a instrução" });
    }
    if (null == req.body.tempoPreparo) {
        return res.status(422).json({ message: "Falta o tempo de preparo" });
    }
    if (null == req.body.tipoPrato) {
        return res.status(422).json({ message: "Falta o tipo de prato" });
    }

    // fazer a verificação se o "ingredientes" é realmente um array

    let nova_receita = {};
    nova_receita.titulo = req.body.titulo;
    nova_receita.ingredientes = req.body.ingredientes;
    nova_receita.instrucoes = req.body.instrucoes;
    nova_receita.tempoPreparo = req.body.tempoPreparo;
    nova_receita.tipoPrato = req.body.tipoPrato;
    receitas.push(nova_receita);
    res.status(200).json({ message: "Inserção de nova receita concluida" });
});

// Update
app.put("/receita/:id", (req, res) => {
    let receitaObj = receitas[req.params.id];
    if (null == receitaObj) {
        return res.status(422).json({ message: "ID de receita não existe!" });
    }

    if (null != req.body.titulo) {
        receitaObj.titulo = req.body.titulo;
    }
    if (null != req.body.ingredientes) {
        receitaObj.ingredientes = req.body.ingredientes;
    }
    if (null != req.body.instrucoes) {
        receitaObj.instrucoes = req.body.instrucoes;
    }
    if (null != req.body.tempoPreparo) {
        receitaObj.tempoPreparo = req.body.tempoPreparo;
    }
    if (null != req.body.tipoPrato) {
        receitaObj.tipoPrato = req.body.tipoPrato;
    }
    receitas[req.params.id] = receitaObj;
    return res.status(200).json({ message: "Receita atualizada com sucesso!" });
});

// Delete
app.delete("/receita/:id", (req, res) => {
    if (req.params.id >= receitas.length) {
        return res.status(422).json({ message: "ID nao pode ser encontrado!" });
    }
    receitas.splice(req.params.id, 1);
    return res.status(200).json({ message: "Receita removida com sucesso!" });
});

const httpsServer = https.createServer( 
    { 
        key: process.env.KEY,
        cert: process.env.CERT, 
    }, 
    app
) 

httpsServer.listen(443, "localhost", () => {
    console.log("Server https rodando na url https://localhost:443");
});