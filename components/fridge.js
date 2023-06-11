import styles from "./fridge.module.css"
import { useSession } from "next-auth/react";
import IngredientCard from "./ingredientCard";
import { useState } from "react";

let test = [ { id: 1, name: 'Tomato' }, { id: 3, name: 'Milk' },
                { id: 4, name: 'Tomato' }, { id: 31, name: 'Milk' },
                { id: 15, name: 'Tomato' }, { id: 32, name: 'Milk' },
                { id: 17, name: 'Tomato' }, { id: 33, name: 'Milk' },
                { id: 19, name: 'Tomato' }, { id: 34, name: 'Milk' },
                { id: 12, name: 'Tomato' }, { id: 35, name: 'Milk' },
                { id: 11, name: 'Tomato' }, { id: 38, name: 'Milk' },
                { id: 10, name: 'Tomato' }, 
        ];

export default  function Fridge({fridgeContent, otherIng}){
    
    const [myIngredients, setMyIngredients] = useState(fridgeContent)
    const [otherIngredients, setOtherIngredients] = useState(otherIng)
    const [fridgeState, setFridgeState] = useState('myfridge')

    const { data: session, status } = useSession()
    let userId = ''
    if (status === "authenticated") userId = session.user.id

    
    async function saveChanges(){
        const aux = fridgeContent.concat(myIngredients.filter((e) => fridgeContent.indexOf(e) < 0))
        const toBeAdded = aux.filter(n => !fridgeContent.includes(n))
        const toBeRemoved = aux.filter(n => !myIngredients.includes(n))
        // console.log(aux)
        // const a = [1, 4, 6]
        // const b = [2, 4, 5, 7]
        // console.log(a.filter(n => !b.includes(n)))
        const opt = {
            method: "POST",
            headers : { 'Content-Type': 'application/json'},
            body: JSON.stringify({id: userId, others: 'update', toAdd: toBeAdded, toRemove: toBeRemoved })
        }
        await fetch('http://localhost:3000/api/user', opt)
            .then(res =>  res.text())
            .then((data) => {
                Promise.resolve(data ? JSON.parse(data) : {})
                
        })
        console.log("afsdg")
    }

    return(
        <div className={styles.container}>
            <div className={styles.fridge_title}>{fridgeState === 'myfridge' ? 'Your Ingredients' : 'Ingredients'}</div>
            <div className={styles.button_container}>
                {fridgeState === 'myfridge'
                    ? <button className={styles.fridge_button} onClick={() => {setFridgeState('add') }}>Add More</button>
                    : <button className={styles.fridge_button} onClick={() => {setFridgeState('myfridge')}}>My Fridge</button>
                }
                
                <button className={styles.fridge_button} onClick={saveChanges}>Save Changes</button>
            </div>

            {fridgeState === 'myfridge'
                    ? <div className={styles.ing_container}>
                        {myIngredients.length === 0 
                            ? <p>No Ingredients</p> 
                            : myIngredients.map((element) => (
                                <div key={"fridge"+element.id}>
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
                                <div key={"add"+element.id}>
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

