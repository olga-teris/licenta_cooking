import { navLinks, userLinks, loggedUserLinks } from "../utils/data";
import Link from "next/link";
import styles from "./header.module.css";
import {useSession} from "next-auth/react"
import { signOut } from "next-auth/react";

export default function Header(props) {
    const { data: session } = useSession()
    // const { data: session } = props.session

    // async function handleLogOut() {
    //     const status = await signIn('credentials', {
    //         redirect: false,
    //         email: values.email ,
    //         password: values.password,
    //         callbackUrl: "/"
    //     })

    //     if(status.ok) router.push(status.url)
    // }

    return (
        <div>
            {session ? HeaderUser() : HeaderGuest()}
        </div>
    )

    function HeaderGuest(){
        return(
        <header>
            <nav className={styles.navbar} >
                <div className={styles.logo}>Cooking      </div>
                <div className={styles.navbar_left}>
                    {navLinks.map((link, index) => {
                            return (
                                <div key = {index}>
                                    <Link className={styles.linkstyle} href={link.path}>
                                        {link.name}
                                    </Link>
                                </div>
                            )
                        })}
                </div>
                <div className={styles.navbar_right}>
                    {userLinks.map((link, index) => {
                        return (
                                <div key = {index}>
                                    <Link className={styles.user_linkstyle} href={link.path}>
                                        {link.name}
                                    </Link>
                                </div>
                            )
                        })}
                </div>
            </nav>
        </header>
        )
    }

    function HeaderUser(){
        return(
        <header>
            <nav className={styles.navbar} >
                <div className={styles.logo}>Cooking      </div>
                <div className={styles.navbar_left}>
                    {navLinks.map((link, index) => {
                            return (
                                <div key = {index}>
                                    <Link className={styles.linkstyle} href={link.path}>
                                        {link.name}
                                    </Link>
                                </div>
                            )
                        })}
                </div>
                <div className={styles.navbar_right}>

                    <Link className={styles.user_linkstyle} href={loggedUserLinks[0].path}>
                        {loggedUserLinks[0].name}
                    </Link>
                    <button className={styles.user_linkstyle} onClick={() => signOut({ callbackUrl: '/' })}>
                        {loggedUserLinks[1].name}
                    </button>
                </div>
            </nav>
        </header>
        )
    }
}
