import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react';
import { signIn, signOut } from "next-auth/react"
import { useFormik } from 'formik';
import login_validate from '../lib/validate';
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
        // validate : login_validate,
        validate: () => ({}),
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
    }

    return (
        <>
        <Head>
            <title>Login</title>
        </Head>
        
        <div className={styles.container}>
            <div className={styles.login_img}>
                <div className={styles.login_wrap}>
                    <form className={styles.login_form} onSubmit={formik.handleSubmit} >
                        <h1>Login</h1>
                        <input 
                            type="email"
                            name='email'
                            placeholder='Email'
                            {...formik.getFieldProps('email')}
                        />
                        <p className='error'>{formik.errors.email && formik.touched.email}</p>
                        <input 
                            type={`${show ? "text" : "password"}`}
                            name='password'
                            placeholder='Password'
                            {...formik.getFieldProps('password')}
                        />
                        <p className='error'>{formik.errors.password && formik.touched.password}</p>
                        <div className="input-button">
                            <button type='submit'>
                                Login
                            </button>
                        </div>
                        <p className='text-center text-gray-400 '>
                            Don't have an account yet? <Link href={'/register'}>Sign Up</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
        </>
        
    )
}