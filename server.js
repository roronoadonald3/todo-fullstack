import {fastify} from "fastify"
import fastifyStatic from "@fastify/static"
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getuser,gettodos} from "./routes/get.js";
import { showpages } from "./utils/showpage.js";
import { isconnected,authlogin } from "./utils/verify.js";
import secureSession from '@fastify/secure-session'
import {readFile} from "node:fs/promises"
import { storedata,registeruser,logout,Sendmail, verifycode } from "./routes/post.js";
import fastifyFormbody from "@fastify/formbody"
import { dotask,undotask } from "./routes/put.js";
import { deltask } from "./routes/delete.js";
import dotenv from "dotenv"
dotenv.config()
import mailerPlugin  from "./utils/mailer.js";
import fastifyMultipart from '@fastify/multipart';




export const dossier=dirname(fileURLToPath(import.meta.url))
const key=await readFile(join(dossier,"secret-key"))

 const app=fastify()
 await app.register(mailerPlugin)
 app.register(fastifyMultipart);

app.register(secureSession, {
 
  sessionName: 'session',
  
  cookieName: 'session',
 
  key:Buffer.from(key.toString('hex'), 'hex'),

  expiry: 24 * 30 * 60, 
  cookie: {
    path: '/'
  }
})
 app.register(fastifyFormbody)
app.register(fastifyStatic,
    {
        root:join(dossier,'templates'),
        prefix:"/",
    })
app.get("/",async(req,res)=>{return res.type("text/html").sendFile("index.html")})
app.get("/data/users",async (req,res)=>{let user= req.query.user;getuser(req,res,user)})
app.get("/data/todos",(req,res)=>{gettodos(req,res)})
app.post("/data/add",(req,res)=>{storedata(isconnected(req),req,res)})
app.post("/log/user",(req,res)=>{authlogin(req,res)})
app.post("/register/user",(req,res)=>{registeruser(req,res)})
app.post("/logout/user",(req,res)=>{logout(req,res)})
app.get("/:page",(req,res)=>{showpages(req,res)})
app.put("/data/do",(req,res)=>{dotask(req,res)})
app.put("/data/undo",(req,res)=>{undotask(req,res)})
app.delete("/data/rem",(req,res)=>{deltask(req,res)})
app.post("/send/mail",(req,res)=>{Sendmail(req,res,app)})
app.post("/verify/code",(req,res)=>{verifycode(req,res)})
const start= async ()=>{
        const PORT = process.env.PORT || 3000;
        await app.listen({ port: PORT , host:"0.0.0.0"});

        console.log("serveur à l'ecoute sur le port 3000")
}
start()