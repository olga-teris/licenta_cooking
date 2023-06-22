import styles from "./profile.module.css"
import { useSession } from "next-auth/react"
import { FiMail, FiSettings } from 'react-icons/fi'
import Link from "next/link"
import { useState } from "react"
import { authOptions } from "../pages/api/auth/[...nextauth]" 
import { getServerSession } from "next-auth";
import Fridge from "../components/fridge"
import Preferences from "../components/preferences"
import Contraindications from "../components/contraindications"
import ProfileDefault from "../components/profileDefault"

    

export default   function Profile(props){
    const [profileState, setProfileInfo] = useState('');

    const profile = () => {
        // console.log("state", profileState)
        switch (profileState) {
            case 'fridge':
                return  <Fridge fridgeContent = {props.fridgeContent} otherIng={props.otherIng}/>
            case 'preferences':
                return <Preferences  allIng = {props.allIng} liked = {props.likedIng} disliked={props.dislikedIng} />
            case 'contraindications':
                return <Contraindications myContr = {props.myContr} otherContr = {props.otherContr} />
            default:
                return <ProfileDefault/>
        }
    }
    

    const { data: session, status } = useSession()
    // console.log(status)
    let email = " "
    let myName = ' '
    if (status === "authenticated") {
        email = session.user.email;
        myName = session.user.name}
    // console.log(session)
    return (
        <div className={styles.container}>
           {/* {bio} */}
            <div className={styles.bio_wrap}>
                <img src="/images/user_img.png" className={styles.user_pfp}></img> 
                <h1 className={styles.user_hello}>Hello, {myName}!</h1>
                <div className={styles.icon_row}>
                    <FiMail className={styles.icon}/>
                    <p className={styles.icon_text}>{email}</p>
                </div>
                <div className={styles.icon_row}>
                    <FiSettings className={styles.icon}/> 
                    <p className={styles.icon_text}>Edit Profile</p>
                </div>
            </div>

            {/* {personalizare} */}
            <div className={styles.personalize_wrap}>
                <div className={styles.personalize_item}>
                    <img src="/images/fridge.jpg" className={styles.personalize_icon}></img>
                    <p className={styles.icon_text2} onClick={() => setProfileInfo('fridge')}>My Fridge</p>
                </div>
                <div className={styles.personalize_item}>
                    <img src="/images/ingredients.png" className={styles.personalize_icon}></img>
                    <p className={styles.icon_text2} onClick={() => setProfileInfo('preferences')}>Preferences</p>
                </div>
                <div className={styles.personalize_item}>
                    <img src="/images/health.png" className={styles.personalize_icon}></img>
                    <p className={styles.icon_text2} onClick={() => setProfileInfo('contraindications')}>Contraindications</p>
                </div>
                <div className={styles.personalize_item}>
                    <img src="/images/others.png" className={styles.personalize_icon}></img>
                    <Link className={styles.icon_text2} href={'/recommendations'}>Recommendations</Link>
                </div>
            </div>

            {/* {info} */}
            <div className={styles.info_wrap}>
                   { profile() }
                   
            </div>
        </div>
    )
}

export async function getServerSideProps(context){
    const session = await getServerSession(context.req, context.res, authOptions)
    // console.log("---------", session)
    if(!session){
      return {
        redirect : {
          destination: '/login',
          permanent: false
        }
      }
    }

    let userId = session.user.id

    //data for FRIDGE component
    const options = {
        method: "POST",
        headers : { 'Content-Type': 'application/json'},
        body: JSON.stringify({id: userId, others: 'no'})
    }
    async function getFridgeContent(){
        let r = await fetch('http://localhost:3000/api/user', options)
            .then(res =>  res.text())
            .then((data) => {
                const x =  Promise.resolve(data ? JSON.parse(data) : {})
                return x
        })
        return r.fridgeData
    }
    const fridgeContent = await getFridgeContent()
    
    const ingIds= fridgeContent.map(e => e.id)
    const opt = {
        method: "POST",
        headers : { 'Content-Type': 'application/json'},
        body: JSON.stringify({id: userId, others: 'yes', ingIds: ingIds})
    }
    async function getOtherIng(){
        let r = await fetch('http://localhost:3000/api/user', opt)
            .then(res =>  res.text())
            .then((data) => {
                const x =  Promise.resolve(data ? JSON.parse(data) : {})
                return x
        })
        return r.fridgeData
    }
    const otherIng = await getOtherIng()


    //data for CONTRAINDICATIONS component
    const opt1 = {
        method: "POST",
        headers : { 'Content-Type': 'application/json'},
        body: JSON.stringify({id: userId, others: 'no'})
    }
    async function getContrContent(){
        let r = await fetch('http://localhost:3000/api/profile', opt1)
            .then(res =>  res.text())
            .then((data) => {
                const x =  Promise.resolve(data ? JSON.parse(data) : {})
                return x
        })
        return r.contrData
    }
    const myContr = await getContrContent()
    
    const contrIngIds= myContr.map(e => e.id)
    const opt2 = {
        method: "POST",
        headers : { 'Content-Type': 'application/json'},
        body: JSON.stringify({id: userId, others: 'yes', ingIds: contrIngIds})
    }
    async function getOtherContrIng(){
        let r = await fetch('http://localhost:3000/api/profile', opt2)
            .then(res =>  res.text())
            .then((data) => {
                const x =  Promise.resolve(data ? JSON.parse(data) : {})
                return x
        })
        return r.contrData
    }
    const otherContr = await getOtherContrIng()


    //data for PREFERENCES component
    const p1 =  {
        method: "POST",
        headers : { 'Content-Type': 'application/json'},
        body: JSON.stringify({id: userId, others: 'all'})
    }

    const p2 =  {
        method: "POST",
        headers : { 'Content-Type': 'application/json'},
        body: JSON.stringify({id: userId, others: 'like'})
    }

    const p3 =  {
        method: "POST",
        headers : { 'Content-Type': 'application/json'},
        body: JSON.stringify({id: userId, others: 'dislike'})
    }

    async function getAllIng(){
        let r = await fetch('http://localhost:3000/api/preferences', p1)
            .then(res =>  res.text())
            .then((data) => {
                const x =  Promise.resolve(data ? JSON.parse(data) : {})
                return x
        })
        return r.prefData
    }

    async function getLikedIng(){
        let r = await fetch('http://localhost:3000/api/preferences', p2)
            .then(res =>  res.text())
            .then((data) => {
                const x =  Promise.resolve(data ? JSON.parse(data) : {})
                return x
        })
        return r.prefData
    }

    async function getDislikedIng(){
        let r = await fetch('http://localhost:3000/api/preferences', p3)
            .then(res =>  res.text())
            .then((data) => {
                const x =  Promise.resolve(data ? JSON.parse(data) : {})
                return x
        })
        return r.prefData
    }

    const allIng = await getAllIng()
    const likedIng = await getLikedIng()
    const dislikedIng = await getDislikedIng()

    return {
      props: { session, fridgeContent, otherIng, myContr, otherContr, allIng, dislikedIng, likedIng}
    }
  }