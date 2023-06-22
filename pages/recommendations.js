import styles from './recommendations.module.css'
import { useSession } from 'next-auth/react'
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useState } from 'react';

import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]" 
import Recipe from '../components/recipe';

export default function Recommendations(props) {
    const { data: session, status } = useSession()
    const [loading, setLoading] = useState(false)
    const [ingNr, setIngNr] = useState(1);
    const [ filterState, setFilterState ] = useState({
        fridge: false,
        preferences: false,
        contraindications: false
    })
    const [filteredRecipes, setFilteredRecipes] = useState([])

    async function getRecipes(){
        let userId = ' '
        if (status === "authenticated") { userId = session.user.id }
        const options = {
            method: "POST",
            headers : { 'Content-Type': 'application/json'},
            body: JSON.stringify({userId: userId, filterState: filterState, ingNr: ingNr})
        }
        let r = await fetch('http://localhost:3000/api/recipeFilter', options)
            .then(res =>  res.text())
            .then((data) => {
                const x =  Promise.resolve(data ? JSON.parse(data) : {})
                return x
        })
            
        return r
    }

    const showRecipes = async () => {
        setLoading(true)
        const result = await getRecipes()
        setFilteredRecipes(result.recipesInfo)
        // console.log(result.recipesInfo)
        setLoading(false)
    }


    const handleChange = (event) => {
        setFilterState({
          ...filterState,
          [event.target.name]: event.target.checked,
        });
        
      };

    
    let myName = ' '
    if (status === "authenticated") { myName = session.user.name }

    return (
        <div className={styles.page_container}>
            <div className={styles.bio_wrap}>
                <img src="/images/user_img.png" className={styles.user_pfp}></img> 
                <h1 className={styles.user_hello}>Hello, {myName}!</h1>
            </div>
            <p className={styles.page_title}>Here are recipes specially made for YOU!</p>
            <div className={styles.page_description}>
                <p>
                    Joking aside, this is a brilliant way to roast a chicken, on the grill or in the oven. Yes, the chicken looks rather ridiculous on its beer can perch, covered with an herb rub and half-ready to salute you.
                    But hear me out. While the chicken is dry roasting on the outside, the inside is being bathed with steamy beer, keeping the chicken meat wonderfully moist.
                </p>
            </div>

            <div className={styles.recipe_filter_container}>
                <div className={styles.recipe_filter}>
                    <div className={styles.filter_item}>
                        <img src="/images/others.png" className={styles.personalize_icon}></img>
                    </div>

                    <div className={styles.filter_item}>
                        <FormGroup>
                            <FormControlLabel 
                                control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                                    onChange={handleChange} name='fridge'/>} 
                                label="My Fridge" />
                            <FormControlLabel 
                                control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                                    onChange={handleChange} name='preferences'/>} 
                                label="Preferences" />
                            <FormControlLabel 
                                control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                                    onChange={handleChange} name='contraindications'/>} 
                                label="Contraindications" />
                        </FormGroup>
                    </div>

                    <div className={styles.filter_item}>
                        <div className={styles.minIngTitle}>Recipes with ingredients from My Fridge</div>
                        <p className={styles.minIng}>min. ingredients</p>
                        <input type='number' min="1" max="10" className={styles.inputIng} value={ingNr} onChange={(e) => setIngNr(e.target.value)} />
                        
                    </div>
                    <div className={styles.filter_item}>
                        <button className={styles.recipes_button} onClick={showRecipes}>Show Recipes</button>
                    </div>
                
                </div>

                <div className={styles.separator}/>

                <div className={styles.results}>
                    {(loading) ? <div>Loading . . .</div> 
                    : (filteredRecipes.length === 0) ? <p> 0 results </p>
                        : filteredRecipes.map((recipe) => { 
                                    return <div key={recipe.id}>
                                            <Recipe  recipeInfo={recipe}></Recipe>
                                        </div>
                                })
                    }
                </div>
            </div>
        </div>
    )
}


export async function getServerSideProps(context){
    const session = await getServerSession(context.req, context.res, authOptions)
    if(!session){
      return {
        redirect : {
          destination: '/login',
          permanent: false
        }
      }
    }

    return {
      props: { session }
    }
  }