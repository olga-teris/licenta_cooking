import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client"
import { getRecipesInfoByName, getAllRecipeInfo } from "../../lib/recipeLib";

//function to get the combinations of input array
function getCombinations(array) {
    const result = [];
 
    function recurse(cur, rem) {
       if (rem.length === 0) {
        result.push(cur);
       } else {
            result.push(cur);
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
        console.log(filterState)

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

        async function getLiked(){
            const result = await prisma.$queryRaw`SELECT ingredientId FROM preferences WHERE userId=${userId} AND liked=true`
            return result 
        }

        async function getDisliked(){
            const result = await prisma.$queryRaw`SELECT ingredientId FROM preferences WHERE userId=${userId} AND liked=false`
            return result 
        }

        async function getContr(){
            const result = await prisma.$queryRaw`SELECT ingredientId FROM contraindications WHERE userId=${userId}`
            return result 
        }

        async function getFilteredRecipesInfo(filteredRecipes){
            if (filteredRecipes.length === 0) {
                return []
            } else {
                const names = await prisma.$queryRaw`SELECT name FROM recipe WHERE id IN (${Prisma.join(filteredRecipes)});`
                const recipeNames = names.map(e => e.name)
                const filteredRecipesInfo = getRecipesInfoByName(recipeNames)
    
                return filteredRecipesInfo
            }
        }
        
        // fridge=false    preferences=false    contraindications=false
        if (!filterState.fridge && !filterState.preferences && !filterState.contraindications) {
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
        } else if (filterState.fridge && !filterState.preferences && !filterState.contraindications) {
            try
            {
                const fridgeContent = await getFridgeContent()
  
                if (fridgeContent.length < ingNr)
                    return res.status(201).json({ status : true, recipesInfo: [] })
                else {
                    let filteredRecipes = []
                    const fridgeContentIds = fridgeContent.map(e => e.id)
                    const combs = getCombinations(fridgeContentIds)
                    let combinations = combs.filter(function(e) {return e.length >= ingNr})
                    const r = await getAllRecipeIds()
                    const allRecipeIds = r.map(e => e.id)
                    
                    for (const recipe of allRecipeIds) {
                        const aux = await getRecipeIngredients(recipe)
                        const recipeIngredientsIds = aux.map(e => e.ingredientId)
                        
                        for (const c of combinations) {
                            let f = c.every(r => recipeIngredientsIds.includes(r))
                            if (f && !filteredRecipes.includes(recipe)){
                                filteredRecipes.push(recipe) 
                            }
                        }  
                    }                   
                    const filteredRecipesInfo = await getFilteredRecipesInfo(filteredRecipes)
                    return res.status(201).json({ status : true, recipesInfo: filteredRecipesInfo })
                }
            }
            catch (err)
            {
                return res.status(503).json({err: err.toString()});
            }

            //fridge=false    pref=true   contr=false
        } else if (!filterState.fridge && filterState.preferences && !filterState.contraindications) {
            try
            {
                const auxLiked = await getLiked()
                const liked = auxLiked.map(e => e.ingredientId)
                const auxDisliked = await getDisliked()
                const disliked = auxDisliked.map(e => e.ingredientId)
                const r = await getAllRecipeIds()
                const allRecipeIds = r.map(e => e.id)
                let filteredRecipes = []
           
                for (const recipe of allRecipeIds) {
                    const aux = await getRecipeIngredients(recipe)
                    const recipeIngredientsIds = aux.map(e => e.ingredientId)

                    let checkLiked = recipeIngredientsIds.some(r => liked.includes(r))
                    let checkDisliked = recipeIngredientsIds.some(r => disliked.includes(r))
                    if (checkLiked && !checkDisliked){
                        filteredRecipes.push(recipe) 
                    }
                   
                }
                const filteredRecipesInfo = await getFilteredRecipesInfo(filteredRecipes)
                return res.status(201).json({ status : true, recipesInfo: filteredRecipesInfo })
            }
            catch (err)
            {
                return res.status(503).json({err: err.toString()});
            }

            //fridge=false    pref=false   contr=true
        } else if (!filterState.fridge && !filterState.preferences && filterState.contraindications) {
            try
            {
                const auxContr = await getContr()
                const contr = auxContr.map(e => e.ingredientId)
                const r = await getAllRecipeIds()
                const allRecipeIds = r.map(e => e.id)
                let filteredRecipes = []
           
                for (const recipe of allRecipeIds) {
                    const aux = await getRecipeIngredients(recipe)
                    const recipeIngredientsIds = aux.map(e => e.ingredientId)

                    let check = recipeIngredientsIds.some(r => contr.includes(r))
                    if (!check){
                        // console.log("match")
                        filteredRecipes.push(recipe) 
                    }  
                }
                const filteredRecipesInfo = await getFilteredRecipesInfo(filteredRecipes)
                return res.status(201).json({ status : true, recipesInfo: filteredRecipesInfo })
            }
            catch (err)
            {
                return res.status(503).json({err: err.toString()});
            }
            
            // fridge=true   pref=true  contr=false
        } else if (filterState.fridge && filterState.preferences && !filterState.contraindications) {
            try
            {
                const fridgeContent = await getFridgeContent()
  
                if (fridgeContent.length < ingNr)
                    return res.status(201).json({ status : true, recipesInfo: [] })
                else {
                    let filteredRecipes = []
                    const fridgeContentIds = fridgeContent.map(e => e.id)
                    const combs = getCombinations(fridgeContentIds)
                    let combinations = combs.filter(function(e) {return e.length >= ingNr})
                    const r = await getAllRecipeIds()
                    const allRecipeIds = r.map(e => e.id)
                    const auxLiked = await getLiked()
                    const liked = auxLiked.map(e => e.ingredientId)
                    const auxDisliked = await getDisliked()
                    const disliked = auxDisliked.map(e => e.ingredientId)
                    
                    for (const recipe of allRecipeIds) {
                        const aux = await getRecipeIngredients(recipe)
                        const recipeIngredientsIds = aux.map(e => e.ingredientId)
                        let checkLiked = recipeIngredientsIds.some(r => liked.includes(r))
                        let checkDisliked = recipeIngredientsIds.some(r => disliked.includes(r))
                        
                        if (checkLiked && !checkDisliked){
                            for (const c of combinations) {
                                let f = c.every(r => recipeIngredientsIds.includes(r))
                                if (f && !filteredRecipes.includes(recipe)){
                                    filteredRecipes.push(recipe) 
                                }
                            }
                        }
                          
                    }                   
                    const filteredRecipesInfo = await getFilteredRecipesInfo(filteredRecipes)
                    return res.status(201).json({ status : true, recipesInfo: filteredRecipesInfo })
                }
                
            }
            catch (err)
            {
                return res.status(503).json({err: err.toString()});
            }

            //fridge=true    pref=false   contr=true
        } else if (filterState.fridge && !filterState.preferences && filterState.contraindications) {
            try
            {
                const fridgeContent = await getFridgeContent()
  
                if (fridgeContent.length < ingNr)
                    return res.status(201).json({ status : true, recipesInfo: [] })
                else {
                    let filteredRecipes = []
                    const fridgeContentIds = fridgeContent.map(e => e.id)
                    const combs = getCombinations(fridgeContentIds)
                    let combinations = combs.filter(function(e) {return e.length >= ingNr})
                    const r = await getAllRecipeIds()
                    const allRecipeIds = r.map(e => e.id)
                    const auxContr = await getContr()
                    const contr = auxContr.map(e => e.ingredientId)
                    
                    for (const recipe of allRecipeIds) {
                        const aux = await getRecipeIngredients(recipe)
                        const recipeIngredientsIds = aux.map(e => e.ingredientId)
                        let check = recipeIngredientsIds.some(r => contr.includes(r))
                        
                        if (!check){
                            for (const c of combinations) {
                                let f = c.every(r => recipeIngredientsIds.includes(r))
                                if (f && !filteredRecipes.includes(recipe)){
                                    filteredRecipes.push(recipe) 
                                }
                            }
                        }
                          
                    }                   
                    const filteredRecipesInfo = await getFilteredRecipesInfo(filteredRecipes)
                    return res.status(201).json({ status : true, recipesInfo: filteredRecipesInfo })
                }
            }
            catch (err)
            {
                return res.status(503).json({err: err.toString()});
            }

            //fridge=false   pref=true    contr=true
        } else if (!filterState.fridge && filterState.preferences && filterState.contraindications) {
            try
            {
                const auxLiked = await getLiked()
                const liked = auxLiked.map(e => e.ingredientId)
                const auxDisliked = await getDisliked()
                const disliked = auxDisliked.map(e => e.ingredientId)
                const auxContr = await getContr()
                const contr = auxContr.map(e => e.ingredientId)
                const r = await getAllRecipeIds()
                const allRecipeIds = r.map(e => e.id)
                let filteredRecipes = []
           
                for (const recipe of allRecipeIds) {
                    const aux = await getRecipeIngredients(recipe)
                    const recipeIngredientsIds = aux.map(e => e.ingredientId)

                    let checkLiked = recipeIngredientsIds.some(r => liked.includes(r))
                    let checkDisliked = recipeIngredientsIds.some(r => disliked.includes(r))
                    let checkContr = recipeIngredientsIds.some(r => contr.includes(r))
                    if (checkLiked && !checkDisliked && !checkContr){
                        filteredRecipes.push(recipe) 
                    }
                   
                }
                const filteredRecipesInfo = await getFilteredRecipesInfo(filteredRecipes)
                return res.status(201).json({ status : true, recipesInfo: filteredRecipesInfo })
                
            }
            catch (err)
            {
                return res.status(503).json({err: err.toString()});
            }

            //toate 3 true
        } else if (filterState.fridge && filterState.preferences && filterState.contraindications) {
            try
            {
                const fridgeContent = await getFridgeContent()
  
                if (fridgeContent.length < ingNr)
                    return res.status(201).json({ status : true, recipesInfo: [] })
                else {
                    let filteredRecipes = []
                    const fridgeContentIds = fridgeContent.map(e => e.id)
                    const combs = getCombinations(fridgeContentIds)
                    let combinations = combs.filter(function(e) {return e.length >= ingNr})
                    const r = await getAllRecipeIds()
                    const allRecipeIds = r.map(e => e.id)
                    const auxLiked = await getLiked()
                    const liked = auxLiked.map(e => e.ingredientId)
                    const auxDisliked = await getDisliked()
                    const disliked = auxDisliked.map(e => e.ingredientId)
                    const auxContr = await getContr()
                    const contr = auxContr.map(e => e.ingredientId)
                    
                    for (const recipe of allRecipeIds) {
                        const aux = await getRecipeIngredients(recipe)
                        const recipeIngredientsIds = aux.map(e => e.ingredientId)
                        let checkLiked = recipeIngredientsIds.some(r => liked.includes(r))
                        let checkDisliked = recipeIngredientsIds.some(r => disliked.includes(r))
                        let checkContr = recipeIngredientsIds.some(r => contr.includes(r))
                        if (checkLiked && !checkDisliked && !checkContr){
                            for (const c of combinations) {
                                let f = c.every(r => recipeIngredientsIds.includes(r))
                                if (f && !filteredRecipes.includes(recipe)){
                                    filteredRecipes.push(recipe) 
                                }
                            }
                        }
                          
                    }                   
                    const filteredRecipesInfo = await getFilteredRecipesInfo(filteredRecipes)
                    return res.status(201).json({ status : true, recipesInfo: filteredRecipesInfo })
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