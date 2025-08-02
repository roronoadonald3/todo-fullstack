import { verify, verifySync } from "@node-rs/argon2"
import db from "../data/prepare.js"


export function isconnected(req) {
    if(req.session.user){
        return true
    }
    return false
}

export function authlogin(req,res) {
    let mail=req.body.mail
    let vpassword=req.body.password
    let {password,id}=db.prepare("select password,id from users where email=? ").get(mail)
    console.log(password,id)
    if(!password){
        res.redirect("http://localhost:3000/login")
    }
    console.log(verifySync(password,vpassword))
    if(verifySync(password,vpassword)){
        req.session.set("user",{"id":id,"mail":mail})
        return res.redirect("http://localhost:3000/todos?msg=connected")
    }else{
        return res.redirect("http://localhost:3000/login")
    }
    
    

}