const express = require('express');
let router = express.Router();
const noteserv = require('../service/note.service');


router.post("/",async function(req,res,next){
    try{
        res.json(await noteserv.addnote(req.body))
    }catch(err){
        console.error(`Erreur lors de l'enregistrement de l'utilisateur `,err.message)
        next(err)
    }
})

router.get('/id', async function(req, res, next) {
    try {
        res.json(await noteserv.noteartiste(req.query.id));
    } catch(err) {
        console.error(`error while getting students`, err.message);
        next(err)
    }
})


module.exports = router;