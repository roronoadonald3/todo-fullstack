import db from "../data/prepare.js";

export async function dotask(req,res){
    if(req.session.user){
        console.log('ici')
        let {id,mail}=req.session.user
        let name=req.body
        name=JSON.parse(name)
        name=name.name
        const row = await db('todos')
  .where({ user_id: id, name: name })
  .first();

const status = row ? row.status : null; // null si pas trouvé

        console.log(status,id,name)
        if(status===false){
           await db('todos')
  .where({ user_id: id, name: name })
  .update({ status: true });

            console.log("done")
        }
    }
}

export async function undotask(req,res){
    if(req.session.user){
        console.log('ici')
        let {id,mail}=req.session.user
        let name=req.body
        name=JSON.parse(name)
        name=name.name
       const row = await db('todos')
  .where({ user_id: id, name: name })
  .first();

const status = row ? row.status : null; // null si pas trouvé

        console.log(status,id,name)
        if(status===true){
          await db('todos')
  .where({ user_id: id, name: name })
  .update({ status: false });

            console.log("done")
        }
    }

}