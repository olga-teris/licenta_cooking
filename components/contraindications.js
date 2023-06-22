import styles from './contraindications.module.css'
import { useSession } from "next-auth/react";
import IngredientCard from "./ingredientCard";
import { useState } from "react";

export default function Contraindications({myContr, otherContr}){

    const [myIngredients, setMyIngredients] = useState(myContr)
    const [otherIngredients, setOtherIngredients] = useState(otherContr)
    const [contrState, setContrState] = useState('contraindications')


    const { data: session, status } = useSession()
    let userId = ''
    if (status === "authenticated") userId = session.user.id

    
    async function saveChanges(){
        const aux = myContr.concat(myIngredients.filter((e) => myContr.indexOf(e) < 0))
        const toBeAdded = aux.filter(n => !myContr.includes(n))
        const toBeRemoved = aux.filter(n => !myIngredients.includes(n))

        // console.log(toBeAdded)
        const opt = {
            method: "POST",
            headers : { 'Content-Type': 'application/json'},
            body: JSON.stringify({id: userId, others: 'update-contr', toAdd: toBeAdded, toRemove: toBeRemoved })
        }
        await fetch('http://localhost:3000/api/profile', opt)
            .then(res =>  res.text())
            .then((data) => {
                Promise.resolve(data ? JSON.parse(data) : {})
                
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.fridge_title}>{contrState === 'contraindications' ? 'Your Contraindications' : 'Ingredients'}</div>
            <div className={styles.button_container}>
                {contrState === 'contraindications'
                    ? <button className={styles.fridge_button} onClick={() => {setContrState('add') }}>Add More</button>
                    : <button className={styles.fridge_button} onClick={() => {setContrState('contraindications')}}>My Contraindications</button>
                }
                
                <button className={styles.fridge_button} onClick={saveChanges}>Save Changes</button>
            </div>

            {contrState === 'contraindications'
                    ? <div className={styles.ing_container}>
                        {myIngredients.length === 0 
                            ? <p>No Ingredients</p> 
                            : myIngredients.map((element) => (
                                <div key={"contraindications"+element.id}>
                                    <IngredientCard  ingredientInfo={element} 
                                            removeState={myIngredients} 
                                            setRemoveState={setMyIngredients}
                                            addState={otherIngredients}
                                            setAddState={setOtherIngredients}
                                            buttonText={'Remove'}/>           
                                </div>
                        ) )}
                    </div>
                    : <div className={styles.ing_container}>
                        {otherIngredients.length === 0 
                            ? <p>No Ingredients</p> 
                            : otherIngredients.map((element) => (
                                <div key={"addd"+element.id}>
                                    <IngredientCard  ingredientInfo={element} 
                                            removeState={otherIngredients} 
                                            setRemoveState={setOtherIngredients}
                                            addState={myIngredients}
                                            setAddState={setMyIngredients}
                                            buttonText={'Add'}/>           
                                </div>
                        ) )}
                    </div>
            }
            
        </div>
    )
}