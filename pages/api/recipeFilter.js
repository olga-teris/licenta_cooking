import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client"
import { getRecipeInfoByName, getAllRecipeInfo } from "../../lib/recipeLib";

//function to get the combinations of input array
function getCombinations(array) {
    const result = [];
 
    function recurse(cur, rem) {
       if (rem.length === 0) {
       result.push(cur);
       } else {
          for (let i = 0; i < rem.length; i++) {
             recurse([...cur, rem[i]], rem.slice(i + 1));
          }
       }
    }
 
    recurse([], array);
    return result;
}

export default async function handler(req, res){
    
    if(req.method === 'POST'){

        if(!req.body) return res.status(404).json({ error: "Don't have form data...!"});
        const { filterState } = req.body
        const { userId } = req.body
        const { ingNr } = req.body

        async function getFridgeContent() {
            const result = await prisma.$queryRaw`SELECT id, name FROM ingredient JOIN fridge as f ON id=f.ingredientId WHERE f.userId=${userId}`
            // console.log(result)
            return result
        }

        async function getAllRecipeIds() {
            const result = await prisma.$queryRaw`SELECT id FROM recipe`
            // console.log(result)
            return result
        }

        async function getRecipeIngredients(id){
            const result = await prisma.$queryRaw`SELECT ingredientId FROM recipeIng WHERE recipeId=${id}`
            // console.log(result)
            return result
        }
        
        // fridge=false    preferences=false    contraindications=false
        if (!filterState.fridge && !filterState.preferences && !filterState.contradictions) {
            try
            {
                const allRecipesInfo = getAllRecipeInfo()
                return res.status(201).json({ status : true, recipesInfo: allRecipesInfo })
            }
            catch (err)
            {
                return res.status(503).json({err: err.toString()});
            }

        // fridge=true    preferences=false    contraindications=false
        } else if (filterState.fridge && !filterState.preferences && !filterState.contradictions) {
            try
            {
                const fridgeContent = await getFridgeContent()
  
                if (fridgeContent.length < ingNr)
                    return res.status(201).json({ status : true, recipesInfo: [] })
                else {
                    const fridgeContentIds = fridgeContent.map(e => e.id)
                    const combs = getCombinations(fridgeContentIds)
                    console.log(combs)
                    // const combinations = combs.map((e) => {if(e.length<ingNr) return e})
                    let combinations = combs.filter(function(e) {return e.length >= ingNr})
                    console.log(combinations)

                    const r = await getAllRecipeIds()
                    const allRecipeIds = r.map(e => e.id)
                    // console.log(allRecipeIds)

                    for (const recipe of allRecipeIds) {
                        const aux = await getRecipeIngredients(recipe)
                        const recipeIngredientsIds = aux.map(e => e.ingredientId)
                        // console.log("x",recipeIngredientsIds)
                        
                    }
                    
                    return res.status(201).json({ status : true, recipesInfo: [] })
                }
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