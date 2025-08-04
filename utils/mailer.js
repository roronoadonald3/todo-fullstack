import fp from "fastify-plugin"
import mailer from "fastify-mailer"
import dotenv from 'dotenv'

dotenv.config()

export default fp(async function (app) {
    app.register(mailer,{
        defaults:{from: process.env.MAIL_DEFAULT_FROM},
        transport:{
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE==='true',
            auth:{
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            pool:true,
            maxConnections:5,
            maxMessages:100
        }
    })
})