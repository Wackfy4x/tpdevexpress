const express = require('express');
let router = express.Router();
const utilisateurserv = require('../service/utilisateur.service');

router.post("/register",async function(req,res,next){
    try{
        res.json(await utilisateurserv.register(req.body))
    }catch(err){
        console.error(`Erreur lors de l'enregistrement de l'utilisateur `,err.message)
        next(err)
    }
})

router.post("/login", async function(req,res,next){
    try{
        res.json(await utilisateurserv.login(req.body))
    }catch(err){
        console.error(`Erreur lors de la connexion de l'utilisateur `,err.message)
        next(err)
    }
})


module.exports = router;