import { hash } from 'bcryptjs';
import prisma from "../../../lib/prisma";

export default async function handler(req, res){
    

    // only post method is accepted
    if(req.method === 'POST'){

        if(!req.body) return res.status(404).json({ error: "Don't have form data...!"});
        const { name, email, password } = req.body;

        try
        {
            const hashedpass = await hash(password, 0);
            // console.log(hash);
            const a = await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: hashedpass
                }
            });
            
            return res.status(201).json({ status : true, user: a.id})
        }
        catch (err)
        {
            return res.status(503).json({err: err.toString()});
        } 

    } else{
        res.status(500).json({ message: "HTTP method not valid only POST Accepted"})
    }

}