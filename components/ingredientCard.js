import styles from './ingredientCard.module.css'

export default function IngredientCard({ingredientInfo, removeState, setRemoveState, addState, setAddState, buttonText}) {
    return (
        <div className={styles.card}>
            <div className={styles.ing_name}>
                {ingredientInfo.name}
            </div>
            <button className={styles.ing_button} onClick={() => {
                                        setRemoveState(
                                            removeState.filter(elem => elem.id !== ingredientInfo.id)
                                        )
                                        setAddState([
                                            ...addState,
                                            ingredientInfo
                                        ])
                                        }}>{buttonText}</button>
            
        </div>
    )
}