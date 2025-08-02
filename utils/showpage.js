import { dirname, join } from 'path';
import { access } from "fs/promises";
import { dossier } from '../server.js';

export async function showpages(req,res) {
    let pages=["login","signup","todos"]
    const { page } = req.params;
    const filePath = join(dossier, 'templates', `${page}.html`);
    if (page.includes(".")){
        return res.sendFile(page)
    }
    else if(pages.includes(page)){
        if(req.query.msg){
            console.log(req.query.msg)
            return res.type("text/html").sendFile(`${page}.html`)
        }
        if(req.session.user){
            return res.redirect("/todos?msg=connected")
        }
    }
    try{
        await access(filePath)
        return res.type("text/html").sendFile(`${page}.html`)
    }catch(e){
        console.log(e)
        return res.type("text/html").code(404).send("404 page non trouvée")
    }
}