const express = require("express");
const router = express.Router();

router.get("/articles", (req, res) => {
    res.send("Rota de Artigos")
});

router.get("/admin/articles/new", (req, res) => {
    res.send("Rota para criar um artigo")
});

module.exports = router;