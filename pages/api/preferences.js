import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client"

export default async function handler(req, res){
    
    if(req.method === 'POST'){

        if(!req.body) return res.status(404).json({ error: "Don't have form data...!"});
        const { id } = req.body
        const { others } = req.body

        if (others === 'like') {
            try
            {
                const result = await prisma.$queryRaw`SELECT id, name FROM ingredient JOIN preferences as p ON id=p.ingredientId WHERE p.userId=${id} AND p.liked=true ORDER BY name`
                // console.log("api fridge content  ", result)
                return res.status(201).json({ status : true, prefData: result})
            }
            catch (err)
            {
                return res.status(503).json({err: err.toString()});
            }
        } else if (others === 'dislike'){
            try
            {  
                const result = await prisma.$queryRaw`SELECT id, name FROM ingredient JOIN preferences as p ON id=p.ingredientId WHERE p.userId=${id} AND p.liked=false ORDER BY name`

                return res.status(201).json({ status : true, prefData: result})
            }
            catch (err)
            {
                return res.status(503).json({err: err.toString()});
            }
        } else if (others === 'all'){
            try
            {  
                const result = await prisma.$queryRaw`SELECT id, name FROM ingredient ORDER BY name`

                return res.status(201).json({ status : true, prefData: result})
            }
            catch (err)
            {
                return res.status(503).json({err: err.toString()});
            }
        } else if (others === 'like-add'){
            try
            {  
                const { toAdd } = req.body
                
                const result = await prisma.$queryRaw`INSERT IGNORE INTO preferences(userId,ingredientId, liked) VALUES (${id},${toAdd},true);`

                // console.log(result)

                return res.status(201).json({ status : true})
            }
            catch (err)
            {
                console.log(err)
                return res.status(503).json({err: err.toString()});
            }
        } else if (others === 'dislike-add'){
            try
            {  
                const { toAdd } = req.body
                
                const result = await prisma.$queryRaw`INSERT IGNORE INTO preferences(userId,ingredientId, liked) VALUES (${id},${toAdd},false);`

                // console.log(result)

                return res.status(201).json({ status : true})
            }
            catch (err)
            {
                console.log(err)
                return res.status(503).json({err: err.toString()});
            }
        } else if (others === 'like-remove'){
            try
            {  
                const { toRemove } = req.body
                
                const result = await prisma.$queryRaw`DELETE FROM preferences WHERE userId=${id} AND ingredientId=${toRemove} AND liked=true`

                // console.log(result)

                return res.status(201).json({ status : true})
            }
            catch (err)
            {
                console.log(err)
                return res.status(503).json({err: err.toString()});
            }
        } else if (others === 'dislike-remove'){
            try
            {  
                const { toRemove } = req.body
                
                const result = await prisma.$queryRaw`DELETE FROM preferences WHERE userId=${id} AND ingredientId=${toRemove} AND liked=false`

                // console.log(result)

                return res.status(201).json({ status : true})
            }
            catch (err)
            {
                console.log(err)
                return res.status(503).json({err: err.toString()});
            }
        } 
        


         

    } else{
        res.status(500).json({ message: "HTTP method not valid only GET Accepted"})
    }

}