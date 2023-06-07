import { footerLinks } from "../utils/data";
import Link from "next/link";
import styles from "./footer.module.css";

export default function Footer() {
    return (
        <nav className={styles.footer} >
                <ul>
                    {
                        footerLinks.map((link, index) => {
                            return (
                                <li key = {index}>
                                    <Link className={styles.linkstyle} href={link.path}>
                                        {link.name}
                                    </Link>
                                </li>
                            )
                        })}
                </ul>
            </nav>
    )
}
