import database from "better-sqlite3" 

const db= new database("./data/base.db")

db.prepare(`create table if not exists users (
    
    id integer primary key autoincrement,
    name varchar(50),
    password varchar(1000),
    profile varchar (50)    
    )
    
    `).run()

db.prepare(`create table if not exists todos (
        id integer primary key autoincrement,
        name varchar(50),
        status boolean,
        date varchar(20)
    
    )
    `).run()



    export default db

