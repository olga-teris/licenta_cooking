import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client"
import { getRecipesByCategory , getRecipesByIngredient} from "../../lib/recipeLib";

export default async function handler(req, res){
    
    if(req.method === 'POST'){

        if(!req.body) return res.status(404).json({ error: "Don't have form data...!"});
        
        const { others } = req.body

        if (others === 'categories') {
            try
            {
                const result = await prisma.$queryRaw`SELECT id, name FROM category ORDER BY name`
                // console.log("api fridge content  ", result)
                return res.status(201).json({ status : true, categories: result})
            }
            catch (err)
            {
                return res.status(503).json({err: err.toString()});
            }
        } else if (others === 'filter-category') {
            try
            {
                const {category} = req.body

                const result = getRecipesByCategory(category)

                return res.status(201).json({ status : true, filteredRecipes: result})
            }
            catch (err)
            {
                return res.status(503).json({err: err.toString()});
            }
        } else if (others === 'ingredients') {
            try
            {
                const result = await prisma.$queryRaw`SELECT id, name FROM ingredient ORDER BY name`
                // console.log("api fridge content  ", result)
                return res.status(201).json({ status : true, ingredients: result})
            }
            catch (err)
            {
                return res.status(503).json({err: err.toString()});
            }
        } else if (others === 'filter-ingredient') {
            try
            {
                const {ingredient} = req.body
                

                const result = getRecipesByIngredient(ingredient)

                return res.status(201).json({ status : true, filteredRecipes: result})
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