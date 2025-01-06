const bcrypt = require('bcrypt');
const db = require('./db.service');
const helper = require('../helper');
const config = require('../config');

async function encryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
  
  
async function verifyPassword(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log(isMatch);

    return isMatch;
}

async function register(user){
    try{
        const rows=await db.query(
            "INSERT INTO utilisateur (email, password) VALUES (?,?)",
            [user.email, await encryptPassword(user.password)]
        )
        console.log(rows)
        const data=helper.emptyorRows(rows);
        
        return {
            data
        }
    }catch(error){
        throw new Error("Cet utilisateur existe deja")
    }
}

async function login(user){
    try{
    const rows=await db.query(
        "SELECT * FROM utilisateur WHERE email = ?",[user.email]
    )
    const data=helper.emptyorRows(rows);
    if(data.length>0){
        const correct=await verifyPassword(user.password,data[0].password)
        if(!correct){
            throw new Error("Identifiants incorrects");
        }
        else{
            return getUserById(data[0].id)
            
        }
    }else{
        throw new Error("Identifiants incorrects");  
    }
}catch(error){
    throw error
}
    
}

async function getUserById(id){
    
    const rows=await db.query(
        "SELECT * FROM utilisateur WHERE id="+id+""
    )
    let data=helper.emptyorRows(rows);
    
    return {
        data
    }
}

module.exports = {
    login,
    register
}