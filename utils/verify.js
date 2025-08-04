import { verify, verifySync } from "@node-rs/argon2"
import db from "../data/prepare.js"


export function isconnected(req) {
    if(req.session.user){
        return true
    }
    return false
}

export async function authlogin(req,res) {
    let mail=req.body.mail
    let vpassword=req.body.password
    const user = await db('users').select('password', 'id').where({ email: mail }).first();
    const { password, id } = user;

    console.log(password,id)
    if(!password){
        res.redirect("/login")
    }
    console.log(verifySync(password,vpassword))
    if(verifySync(password,vpassword)){
        req.session.set("user",{"id":id,"mail":mail})
        return res.redirect("/todos?msg=connected")
    }else{
        return res.redirect("/login")
    }
    
    

}