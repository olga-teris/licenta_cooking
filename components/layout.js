import Footer from "./footer.js"
import Header from "./header.js"

export default function Layout( { children }){
    return (
        <div>
            <Header/>
                {children}
            <Footer/>
        </div>
           
    )
}