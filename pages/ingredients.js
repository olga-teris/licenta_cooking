import styles from "./ingredients.module.css"
import {  getAllRecipeInfo } from "../lib/recipeLib"
import Recipe from "../components/recipe"
import { getServerSession } from "next-auth";
import { authOptions } from "next-auth";
import { useState } from "react";
import { IngCarousel } from "../components/recipeCarousel";


export default function Ingredients ({allRecipeInfo, ingredients}) {

    const [filteredRecipes, setFilteredRecipes] = useState(allRecipeInfo)
    const [loading, setLoading] = useState(false)


    async function getRecipes(ingredient){
        const options = {
            method: "POST",
            headers : { 'Content-Type': 'application/json'},
            body: JSON.stringify({ingredient: ingredient, others: 'filter-ingredient'})
        }
        let r = await fetch('http://localhost:3000/api/guestRecipes', options)
            .then(res =>  res.text())
            .then((data) => {
                const x =  Promise.resolve(data ? JSON.parse(data) : {})
                return x
        })
            
        return r
    }

    const clickHandler = async (e) => {
        setLoading(true)

        const result = await getRecipes(e.target.outerText)
        setFilteredRecipes(result.filteredRecipes)

        setLoading(false)
    }

    return (<>
        <div className={styles.explore_container}> 
            <div className={styles.left2}>
                <IngCarousel/>
            </div>
            <div className={styles.right2}>
                Explore recipes by ingredient or type
                <p className={styles.carousel_description}>Knowing your way around a kitchen’s basic ingredients is seriously important – and we’ve split recipes up by their main ingredient.</p>
            </div>
        
        </div>
        <div className={styles.container}>
            <div className={styles.categories}>
                <h1>Ingredients</h1>
                <ul className={styles.cat_list}>
                    {ingredients.map((c) => {
                        return( 
                            <li value={c.name} key={c.name} onClick={clickHandler} >{c.name}</li>
                        
                    )})
                    }
                </ul>
            </div>
            <div className={styles.recipe_list}>
                <div className={ styles.list_container}>
                    
                    {(loading) ? <div>Loading . . .</div> 
                    : (filteredRecipes.length === 0) ? <h2> 0 results </h2>
                        : filteredRecipes.map((recipe) => { 
                                    return <div key={recipe.id}>
                                            <Recipe  recipeInfo={recipe}></Recipe>
                                        </div>
                                })
                    }
                </div>
            </div>

             
        </div>
        </>
    )
}

export async function getServerSideProps(context){
    // const session = await getServerSession(context.req, context.res, authOptions)
    const allRecipeInfo = getAllRecipeInfo();
    const opt =  {
        method: "POST",
        headers : { 'Content-Type': 'application/json'},
        body: JSON.stringify({others: 'ingredients'})
    }

    async function getIngredients(){
        let r = await fetch('http://localhost:3000/api/guestRecipes', opt)
            .then(res =>  res.text())
            .then((data) => {
                const x =  Promise.resolve(data ? JSON.parse(data) : {})
                return x
        })
        return r.ingredients
    }

    const ingredients = await getIngredients()

    return {
        props: { ingredients, allRecipeInfo}
      }
}