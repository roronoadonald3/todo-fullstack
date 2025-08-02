import db from "../data/prepare.js";

export async function dotask(req,res){
    if(req.session.user){
        console.log('ici')
        let {id,mail}=req.session.user
        let name=req.body
        name=JSON.parse(name)
        name=name.name
        let status = await db.prepare("select status from todos where user_id=? and name = ?").get(id,name).status
        console.log(status,id,name)
        if(status===0){
           db.prepare("update todos set status = ? where user_id=? and name=?").run(1,id,name)
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
        let status = await db.prepare("select status from todos where user_id=? and name = ?").get(id,name).status
        console.log(status,id,name)
        if(status===1){
           db.prepare("update todos set status = ? where user_id=? and name=?").run(0,id,name)
            console.log("done")
        }
    }

}