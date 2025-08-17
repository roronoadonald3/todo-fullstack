import { hash } from "@node-rs/argon2";
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

export async function sendresetmail(req,res,app) {
    let body=req.body
    let email=body.email
     const row = await db('users').where({ email }).first();
     let {name}=row?row:null
     if(name===null){
        return res.code(404).send()
     }
     let code=Math.floor(Math.random()*1000000)
     const message =`
  <div style="font-family:Arial, sans-serif; line-height:1.6; color:#333; max-width:600px; margin:auto; padding:20px; border:1px solid #ddd; border-radius:8px;">
    <h2 style="color:#2c3e50;">Bonjour ${name},</h2>

    <p>Vous avez demandé à réinitialiser votre mot de passe sur <strong>RD'S TODOLIST</strong>.</p>

    <p>Voici votre <strong>code de réinitialisation</strong> :</p>

    <div style="background-color:#f0f0f0; padding:15px; text-align:center; font-size:24px; font-weight:bold; border-radius:4px; margin:20px 0;">
      ${code}
    </div>

    <p>Ce code est valable pendant <strong>15 minutes</strong>. Ne le communiquez à personne.</p>

    <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail. Aucun changement ne sera effectué sans ce code.</p>

    <br>
    <p>Cordialement,</p>
    <p><strong>L’équipe RD'S TODOLIST</strong></p>
  </div>
`;
await db('reset').insert({
  mail: email,
  code: code
});

     const to=email
     const subject="Mot de passe oublié?"
     try{
    const info=await app.mailer.sendMail({to,subject,html:message})
    console.log("mesasage envoyé: ", info.messageId)
    return res.redirect("/reset")}catch(e){
        console.log("error   :",e)
        res.code(500).send()
    }
    }

    export async function verifyreset(req,res) {
   let {mail,code}=req.body
  let vcode=code
 const row = await db('reset')
  .where({ mail })
  .orderBy('id', 'desc')
  .first();

  code = row ? row.code : null;  // null si pas trouvé

  if(Number(vcode)===Number(code)){
    req.session.set("code","oklm")
    return res.send("oklm")
    
  }
  console.log(code,mail,vcode)
  return res.code(404).send("not found")
    }

    export async function changepass(req,res) {
      if(req.session.code){
      let{email,pass}=req.body
      pass=await hash(pass)
       await db('users')
  .where({  email})
  .update({password:pass});
        res.send("test")

      }else{
        res.code(404).send()
      }
    }