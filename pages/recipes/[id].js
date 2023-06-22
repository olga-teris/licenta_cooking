import styles from './[id].module.css'
import {  getAllRecipeIds, getRecipeInfo } from "../../lib/recipeLib"
import ReactMarkdown from "react-markdown"

export async function getStaticProps({params}) {
    const recipeInfo = getRecipeInfo(params.id);
    
    // console.log(recipeInfo.content)
    return {
        props: {
            id: params.id,
            recipeData: recipeInfo.data,
            recipeInfo: recipeInfo.content
        }
    };
  }

export default function RecipePage(props){
    return(
        <div className={styles.page}>
            <div className={styles.left}>

            </div>

            <div className={styles.recipe_container}>
                <div className={styles.recipe_header}>
                    <img src={".."+props.recipeData.picture}></img>
                </div>
                <div className={styles.recipe_content}>
                    
                    <ReactMarkdown>{props.recipeInfo}</ReactMarkdown>
                </div>
       
            </div>

            <div className={styles.right}>

            </div>

        </div>
    )
}
export async function getStaticPaths(){

    const paths = getAllRecipeIds()

    return {
        paths,
        fallback: false
    }
}
