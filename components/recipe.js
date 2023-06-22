import Link from 'next/link';
import styles from './recipe.module.css';

export default function Recipe( { recipeInfo } ) {
    // console.log(recipeInfo.picture);
    return (
        
            <div  className={styles.recipe}>
                
                <img src={recipeInfo.picture} className={styles.picture}></img>
                <div className={styles.info}>
                    <Link href={"/recipes/" + recipeInfo.id}>
                        <h1 className={styles.info_title}>{recipeInfo.title}</h1>
                    </Link>
                    <div className={styles.detail_name}>Servings:
                        <p className={styles.detail_info}>
                            {recipeInfo.servings}
                        </p>
                    </div>
                    <div className={styles.detail_name}>Prep:
                        <p className={styles.detail_info}>
                            {recipeInfo.prep}
                        </p>
                    </div>
                    <div className={styles.detail_name}>Cook: 
                        <p className={styles.detail_info}>
                            {recipeInfo.cook}
                        </p>
                    </div>
                </div>
            </div>
      
        
    )
}