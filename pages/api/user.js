import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client"

export default async function handler(req, res){
    
    if(req.method === 'POST'){

        if(!req.body) return res.status(404).json({ error: "Don't have form data...!"});
        const { id } = req.body
        const { others } = req.body

        if (others === 'no') {
            try
            {
                const result = await prisma.$queryRaw`SELECT id, name FROM ingredient JOIN fridge as f ON id=f.ingredientId WHERE f.userId=${id}`
                // console.log("api fridge content  ", result)
                return res.status(201).json({ status : true, fridgeData: result})
            }
            catch (err)
            {
                return res.status(503).json({err: err.toString()});
            }
        } else if (others === 'yes'){
            try
            {  
                const { ingIds } = req.body
                const result = ingIds.length === 0
                    ? await prisma.$queryRaw`SELECT id, name FROM ingredient`
                    : await prisma.$queryRaw`SELECT id, name FROM ingredient WHERE id NOT IN (${Prisma.join(ingIds)});`

                return res.status(201).json({ status : true, fridgeData: result})
            }
            catch (err)
            {
                return res.status(503).json({err: err.toString()});
            }
        } else if (others === 'update'){
            try
            {  
                const { toAdd, toRemove } = req.body 
                const addIng = toAdd.map((e) => {
                    return {ingredientId: e.id, userId: id}})
                const removeIng = toRemove.map((e) => (e.id))

                const r1 = await prisma.fridge.createMany({data : addIng})
                const r2 = await prisma.fridge.deleteMany({
                    where: {
                        AND: [
                            { userId: id },
                            { ingredientId: {in: removeIng} }
                        ]
                    }
                })
                return res.status(201).json({ status : true})
            }
            catch (err)
            {
                return res.status(503).json({err: err.toString()});
            }
        }

         

    } else{
        res.status(500).json({ message: "HTTP method not valid only GET Accepted"})
    }

}