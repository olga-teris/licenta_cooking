import { navLinks, userLinks } from "../utils/data";
import Link from "next/link";
import styles from "./header.module.css";

export default function Header() {
    return (
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
