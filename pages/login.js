import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react';
import { signIn, signOut } from "next-auth/react"
import { useFormik } from 'formik';
import { login_validate } from '../lib/validate';
import { useRouter } from 'next/router';
import styles from './login.module.css'


export default function Login(){
 
    const [show, setShow] = useState(false)

    const router = useRouter()
    // formik hook
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validate : login_validate,
        // validate: () => ({}),
        onSubmit : xsubmit
    })

    async function xsubmit(values) {

        const status = await signIn('credentials', {
                    redirect: false,
                    email: values.email ,
                    password: values.password,
                    callbackUrl: "/"
                })

        if(status.ok) router.push(status.url)
        else formik.errors.password = "Account doesn't exist"
    }

    return (
        <>
        <Head>
            <title>Login</title>
        </Head>
        
        <div className={styles.container}>
            <div className={styles.login_img}>
                <div className={styles.login_wrap}>
                    <form method="post" className={styles.login_form} onSubmit={formik.handleSubmit} >
                        <img src="/images/user_img.png" className={styles.user_pfp}></img> 
                        <h1 className={styles.login_header}>Login</h1>
                        <input 
                            className={styles.input_tab}
                            type="email"
                            name='email'
                            placeholder='Email'
                            {...formik.getFieldProps('email')}
                        />
                        <p className={styles.login_error}>{formik.errors.email && formik.touched.email ? formik.errors.email : ''}</p>
                        <input 
                            className={styles.input_tab}
                            type={`${show ? "text" : "password"}`}
                            name='password'
                            placeholder='Password'
                            {...formik.getFieldProps('password')}
                        />
                        <p className={styles.login_error}>{formik.errors.password && formik.touched.password ? formik.errors.password : ''}</p>
                        <div className="input-button">
                            <button className={styles.login_button} type='submit'>
                                Login
                            </button>
                        </div>
                        <p className={styles.login_bottom}>
                            Don't have an account yet? <Link className={styles.have_acc} href={'/register'}>Sign Up</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
        </>
        
    )
}