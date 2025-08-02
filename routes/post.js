import { hash } from "@node-rs/argon2";
import db from "../data/prepare.js";


/**
 * 
 * @param {boolean} con 
 * @param {*} req 
 * @param {*} res 
 */
export function storedata(con, req, res) {
  if (con) {
    let name = req.body.name
    let description=req.body.description
    let dat = new Date().toLocaleString('fr-FR')
    db.prepare("INSERT INTO todos (name, status, date,user_id,description) VALUES (?, ?, ?,?,?)").run(name, 0, dat,req.session.user.id,description)
    console.log(db.prepare("select * from todos").all())
    return res.redirect("http://localhost:3000/todos")
  } else {
    return res.code(302).redirect("http://localhost:3000/login")
  }
}

export async function registeruser(req,res){
  try {
    let {name,mail, password,conf}=req.body
  password= await hash(password)
  console.log(password)
  db.prepare("INSERT INTO users(id,name,email,password) values (?,?,?,?)").run(Date.now(),name,mail,password)
  return res.code(302).redirect("http://localhost:3000/login")
  } catch (error) {
    console.log(error)
    return  res.code(302).redirect("http://localhost:3000/signup")
  }
  
}

export async function logout(req,res) {
  if(req.session.user){
    req.session.delete()
    res.redirect("http://localhost:3000")
  }else{
    res.code(200).send()
    console.log(req.session.user)
  }
}