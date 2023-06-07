
import { PrismaClient } from "prisma/prisma-client";
import { hash } from 'bcryptjs';

export default async function handler(req, res){
    
    const prisma = new PrismaClient();

    // only post method is accepted
    if(req.method === 'POST'){

        if(!req.body) return res.status(404).json({ error: "Don't have form data...!"});
        const { username, email, password } = req.body;

        // check duplicate users
        // const checkexisting = await Users.findOne({ email });
        // if(checkexisting) return res.status(422).json({ message: "User Already Exists...!"});

        // hash password
        // Users.create({ username, email, password : await hash(password, 12)}, function(err, data){
        //     if(err) return res.status(404).json({ err });
        //     res.status(201).json({ status : true, user: data})
        // })
        try
        {
            const hashedpass = await hash(password, 0);
            // console.log(hash);
            const a = await prisma.users.create({
                data: {
                    username: username,
                    email: email,
                    password: hashedpass
                }
            });
            console.log("^^^^^", a)
            // console.log("****",res.status(200).end())
            // return res.status(200).end();
            
            return res.status(201).json({ status : true, user: a.userId})
        }
        catch (err)
        {
            // console.log(err.toString());
            return res.status(503).json({err: err.toString()});
        } 

    } else{
        res.status(500).json({ message: "HTTP method not valid only POST Accepted"})
    }

}