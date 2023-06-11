import { navLinks, userLinks, loggedUserLinks } from "../utils/data";
import Link from "next/link";
import styles from "./header.module.css";
import {useSession} from "next-auth/react"

export default function Header(props) {
    const { data: session } = useSession()
    // const { data: session } = props.session

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
                    {loggedUserLinks.map((link, index) => {
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
}
