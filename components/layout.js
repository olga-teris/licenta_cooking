import Footer from "./footer.js"
import Header from "./header.js"
import styles from './layout.module.css'

export default function Layout( { children }){
    return (
        <div className={styles.container}>
            <div/>
            <div className={styles.center}>
                <Header/>
                    {children}
                <Footer/>
            </div>
            <div/>
        </div>
           
    )
}