import styles from './preferences.module.css'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function Preferences({allIng, liked, disliked}){

    const [likedIng, setLiked] = useState(liked)
    const [dislikedIng, setDisliked] = useState(disliked)

    const [selectedIng, setSelected] = useState(0)

    // console.log("props liked", liked)

    const { data: session, status } = useSession()
    let userId = ''
    if (status === "authenticated") userId = session.user.id

    function handleChange(e) {
        
        setSelected(parseInt(e.target.value))
    }


    async function likeAdd() {
        // console.log(selectedIng)
        const a = allIng.filter((i) => {return i.id === selectedIng})
        
        const check = likedIng.filter((i) => {return i.id === selectedIng})
        const check2 = dislikedIng.filter((i) => {return i.id === selectedIng})
        if(check.length === 0 && check2.length === 0) setLiked([...likedIng, a[0]])
        
        const opt = {
            method: "POST",
            headers : { 'Content-Type': 'application/json'},
            body: JSON.stringify({id: userId, others: 'like-add', toAdd: selectedIng})
        }
        await fetch('http://localhost:3000/api/preferences', opt)
            .then(res =>  res.text())
            .then((data) => {
                Promise.resolve(data ? JSON.parse(data) : {})
                
        })
    }

    async function dislikeAdd() {
        // console.log(selectedIng)
        const a = allIng.filter((i) => {return i.id === selectedIng})
        const check = dislikedIng.filter((i) => {return i.id === selectedIng})
        const check2 = likedIng.filter((i) => {return i.id === selectedIng})
        if(check.length === 0 && check2.length === 0) setDisliked([...dislikedIng, a[0]])
        // console.log(dislikedIng)
        const opt = {
            method: "POST",
            headers : { 'Content-Type': 'application/json'},
            body: JSON.stringify({id: userId, others: 'dislike-add', toAdd: selectedIng})
        }
        await fetch('http://localhost:3000/api/preferences', opt)
            .then(res =>  res.text())
            .then((data) => {
                Promise.resolve(data ? JSON.parse(data) : {})
                
        })
    }


    async function likeRemove(e) {

        const a = allIng.filter((i) => {return i.id === e.target.value})
        // console.log("a", a)
        const b = likedIng.filter((i) => {return i.id != a[0].id})
        setLiked(b)

        const opt = {
            method: "POST",
            headers : { 'Content-Type': 'application/json'},
            body: JSON.stringify({id: userId, others: 'like-remove', toRemove: e.target.value})
        }
        await fetch('http://localhost:3000/api/preferences', opt)
            .then(res =>  res.text())
            .then((data) => {
                Promise.resolve(data ? JSON.parse(data) : {})
                
        })
    }

    async function dislikeRemove(e) {
        // console.log(selectedIng)
        const a = allIng.filter((i) => {return i.id === e.target.value})
        
        setDisliked(dislikedIng.filter((i) => {return i.id != a[0].id}))
        // console.log(likedIng)
        const opt = {
            method: "POST",
            headers : { 'Content-Type': 'application/json'},
            body: JSON.stringify({id: userId, others: 'dislike-remove', toRemove: e.target.value})
        }
        await fetch('http://localhost:3000/api/preferences', opt)
            .then(res =>  res.text())
            .then((data) => {
                Promise.resolve(data ? JSON.parse(data) : {})
                
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.pref_title}>Your preferences</div>

            <div className={styles.pref_container}>
                <div className={styles.like}>
                    <img src="/images/like.jpg" className={styles.pref_icon}></img>

                    <div className={styles.pref_list}>
                            <div className={styles.list_container}>
                                <p className={styles.select_title}>Liked:</p>
                                <ul>
                                    {likedIng.length === 0
                                    ? <div>No ingredients</div>
                                    : likedIng.map((i) => {
                                        return <li key={i.id} value={i.id} onClick={likeRemove} >{i.name}</li>
                                    })
                                    }
                                </ul>
                            </div>

                            <div className={styles.pref_select}>
                                <p className={styles.select_title}>Choose an ingredient</p>
                                <select onChange={handleChange}>
                                    <option value='0'>-</option>
                                    {allIng.map((i) => {
                                        return <option key={i.id} value={i.id} label={i.name}>{i.name}</option>
                                    })
                                    }
                                </select>

                            </div>
                            <button className={styles.add_button} onClick={likeAdd} >Add</button>
                    </div>

                </div>

                <div className={styles.dislike}>
                    <img src="/images/dislike.jpg" className={styles.pref_icon}></img>
                    <div className={styles.pref_list}>
                            <div className={styles.list_container2}>
                                <p className={styles.select_title}>Disliked:</p>
                                <ul>
                                    {dislikedIng.length === 0
                                    ? <div>No ingredients</div>
                                    : dislikedIng.map((i) => {
                                        return <li key={i.id} value={i.id} onClick={dislikeRemove}>{i.name}</li>
                                    })
                                    }
                                </ul>
                            </div>

                            <div className={styles.pref_select2}>
                                <p className={styles.select_title}>Choose an ingredient</p>
                                <select onChange={handleChange}>
                                    <option value='0'>-</option>
                                    {allIng.map((i) => {
                                        return <option key={i.id} value={i.id} label={i.name}>{i.name}</option>
                                    })
                                    }
                                </select>

                            </div>
                            <button className={styles.add_button2} onClick={dislikeAdd} >Add</button>
                    </div>




                </div>
            </div>

        </div>
    )
}