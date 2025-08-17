import db from "../data/prepare.js"

export  async function getuser(req,res,use) {
    const user = await db('users').where({ name: use }).first();
    if (user===undefined){
        return res.type("text/html").send("non user")
    }else{
        return res.type("application/json").send(user)
    }
}

export async function gettodos(req,res) {
    if(req.session.user){
   const todos = await db('todos').where({ user_id: req.session.user.id }).select();
   console.log(todos)
   if(todos===undefined){
    return res.code(404).send("pas de todos")
   }
   return res.type("application/json").send(todos)}
   else{
    return res.send("pas de todos pour vous mon tres cher")
   }
}

Date().toLocaleLowerCase("fr-FR")