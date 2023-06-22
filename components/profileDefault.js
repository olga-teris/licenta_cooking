import styles from './profileDefault.module.css'

export default function ProfileDefault() {
    return(
        <div className={styles.container}>
            <p className={styles.title}>Get Started</p>
            

            <div className={styles.instructions}>
              <div className={styles.instr1}>Add the ingredients you already have</div>
              <div className={styles.instr2}>
                <img src="/images/arrow.png" className={styles.arrow}></img>
              </div>
              <div className={styles.instr3}>
                <img src="/images/fridge.jpg"className={styles.icon}></img>
                <p className={styles.button2}>My Fridge</p>
              </div>
            </div>

            <div className={styles.instructions}>
              <div className={styles.instr1}>Specify the ingredients that you like and the ones that you don't</div>
              <div className={styles.instr2}>
                <img src="/images/arrow.png" className={styles.arrow}></img>
              </div>
              <div className={styles.instr3}>
                <img src="/images/ingredients.png"className={styles.icon}></img>
                <p className={styles.button2}>Preferences</p>
              </div>
            </div>

            <div className={styles.instructions}>
              <div className={styles.instr1}>Set ingredients that are not allowed due to various health reasons</div>
              <div className={styles.instr2}>
                <img src="/images/arrow.png" className={styles.arrow}></img>
              </div>
              <div className={styles.instr3}>
                <img src="/images/health.png"className={styles.icon}></img>
                <p className={styles.button2}>Contraindications</p>
              </div>
            </div>

            <div className={styles.instructions}>
              <div className={styles.instr1}>Select recipes specially for you filtered by all the criteria above</div>
              <div className={styles.instr2}>
                <img src="/images/arrow.png" className={styles.arrow}></img>
              </div>
              <div className={styles.instr3}>
                <img src="/images/others.png"className={styles.icon}></img>
                <p className={styles.button2}>Recommendations</p>
              </div>
            </div>
        </div>

    )
}