import db from "../data/prepare.js"

export  async function getuser(req,res,use) {
    let user= await db.prepare("SELECT * FROM users WHERE name = ?").get(use)
    if (user===undefined){
        return res.type("text/html").send("non user")
    }else{
        return res.type("application/json").send(user)
    }
}

export async function gettodos(req,res) {
    if(req.session.user){
   let todos=await db.prepare("select * from todos where user_id =?").all(req.session.user.id)
   console.log(todos)
   if(todos===undefined){
    return res.code(404).send("pas de todos")
   }
   return res.type("application/json").send(todos)}
   else{
    return res.send("pas de todos pour vous mon tres cher")
   }
}