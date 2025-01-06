const db = require('./db.service');
const helper = require('../helper');
const config = require('../config');


async function addnote(note) {
    try{
        console.log(note);
        
        const rows=await db.query(
            "INSERT INTO note (utilisateur_id, artiste_id, note) VALUES (?, ?, ?)",
            [note.utilisateur_id, note.artiste_id, note.note]
        )

        const allnote = await db.query(
            "SELECT * FROM note WHERE artiste_id=?",
            [note.artiste_id]
        )
        console.log(allnote);        
        let moy = 0
        for(const data of allnote) {
            moy += data.note
        }
        const moyenne = moy / allnote.length
        console.log(moyenne);
        
        const newuser = await db.query(
            "UPDATE artists SET note=? WHERE id=?",
            [moyenne, note.artiste_id]
        )
        console.log(newuser)
        const data=helper.emptyorRows(rows);
        
        return {
            data
        }
    }catch(error){
        throw new Error("Cet utilisateur existe deja")
    }
}

async function noteartiste(idartiste) {
    try{
        const allnote = await db.query(
            "SELECT * FROM note WHERE artiste_id=?",
            [idartiste]
        )
        const data=helper.emptyorRows(allnote);
        
        return {
            data
        }
    }catch(error){
        throw new Error("Cet utilisateur existe deja")
    }
}

module.exports = {
    addnote,
    noteartiste
}