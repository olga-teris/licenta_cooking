import styles from "./recipe_list.module.css"
import {  getAllRecipeInfo } from "../lib/recipeLib"
import Recipe from "../components/recipe"

export async function getStaticProps() {
  const allRecipeInfo = getAllRecipeInfo();
//   console.log(allRecipeInfo);
  return {
    props: {
      allRecipeInfo
    },
  };
}
export default function RecipeList ({allRecipeInfo}) {

    return (<>
        <div className={styles.general_info}>
            <img src="/images/recipes_general.jpg" className={styles.img}></img>
        </div>
        <div className={styles.container}>
            <div className={styles.categories}>
                <h1>Recipes</h1>
            </div>
            <div className={styles.recipe_list}>
                <div className={ styles.list_container}>
                    {allRecipeInfo.map((recipe) => {
                        return (
                            <div key={recipe.id}>
                            <Recipe  recipeInfo={recipe}>-------</Recipe>
                            </div>
                        )
                    } )}
                </div>
            </div>
        </div>
        </>
    )
}