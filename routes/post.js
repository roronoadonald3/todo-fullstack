import { hash } from "@node-rs/argon2";
import db  from "../data/prepare.js";


/**
 * 
 * @param {boolean} con 
 * @param {*} req 
 * @param {*} res 
 */
export async function storedata(con, req, res) {
  if (con) {
    let name = req.body.name
    let description=req.body.description
    let dat = new Date().toLocaleString('fr-FR')
    await db('todos').insert({
  name: name,
  status: false,      // ou 0 si tu préfères
  date: dat,
  user_id: req.session.user.id,
  description: description
});
const todos = await db('todos').select('*');
console.log(todos);
    return res.redirect("/todos")
  } else {
    return res.code(302).redirect("/login")
  }
}

export async function registeruser(req,res){
  try {
    let {name,mail, password,conf}=req.body
  password= await hash(password)
  console.log(password)
 await db('users').insert({
  id: Date.now(),  // si tu veux gérer l'id toi-même (en général on laisse la DB auto-incrémenter)
  name: name,
  email: mail,
  password: password
});

  return res.redirect("/mail")
  } catch (error) {
    console.log(error)
    return res.code(302).redirect("/signup")
  }
  
}

export async function logout(req,res) {
  if(req.session.user){
    req.session.delete()
    res.redirect("/")
  }else{
    res.code(200).send()
    console.log(req.session.user)
  }
}

export async function Sendmail(req,res,app) {
  const {email}=req.body
  const exist = await db('users').where({ email }).first();

  if(exist){
   return  res.send({"exist":true})
  }
  let randnum = Math.floor(Math.random()*1000000)
  let subject="Code de verification "
  let message=`Bonjour cher utilisateur(trice),

Voici votre code de confirmation :
</p>
<h1>Code : ${randnum}<h1>
<p>
Merci de ne pas partager ce code avec qui que ce soit.

Si vous n'avez pas demandé ce code, veuillez ignorer cet e-mail.
<br>
Cordialement,
RD'S TODOLIST

`
await db('codes').insert({
  mail: email,
  code: randnum
});

let to=email
console.log(email,to,req.body)
const info=await app.mailer.sendMail({to,subject,html:`<p>${message}</p>`})
console.log("mesasage envoyé: ", info.messageId)
 return res.send({ success: true, redirect: "/mail" })

}

export async function verifycode(req,res) {
 const parts = await req.parts();
  const fields = {};
  
  for await (const part of parts) {
    if (part.type === 'file') {
      
      continue;
    }
    fields[part.fieldname] = part.value;
  }

  let { code, mail } = fields;

  let vcode=code
 const row = await db('codes').where({ mail }).first();
  code = row ? row.code : null;  // null si pas trouvé

  if(Number(vcode)===Number(code)){
    return res.send("oklm")
  }
  console.log(code,mail,vcode)
  return res.code(404).send("not found")
}