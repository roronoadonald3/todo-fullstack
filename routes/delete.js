import db from "../data/prepare.js"

export async function deltask(req,res) {
     if(req.session.user){
        console.log('ici')
        let {id,mail}=req.session.user
        let name=req.body
        name=JSON.parse(name)
        name=name.name
        let status = await db.prepare("select status from todos where user_id=? and name = ?").get(id,name).status
        console.log(status,id,name)
        if(status!==undefined){
           db.prepare("delete from todos where user_id=? and name=?").run(id,name)
            console.log("done")
        }
        return res.send()
    }
}