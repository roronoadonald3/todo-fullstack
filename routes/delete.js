import db from "../data/prepare.js"

export async function deltask(req,res) {
     if(req.session.user){
        console.log('ici')
        let {id,mail}=req.session.user
        let name=req.body
        name=JSON.parse(name)
        name=name.name
        const row = await db('todos')
  .where({ user_id: id, name: name })
  .first();

const status = row ? row.status : null;

        console.log(status,id,name)
        if(status!==undefined){
           await db('todos')
  .where({ user_id: id, name: name })
  .del();

            console.log("done")
        }
        return res.send()
    }
}