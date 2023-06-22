import Head from 'next/head'

import Link from 'next/link'

import Image from 'next/image'

import { useState } from 'react';
import { useFormik } from 'formik';
import { registerValidate } from '../lib/validate'
import { useRouter } from 'next/router';
import styles from "./register.module.css"

export default function Register(){

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [show, setShow] = useState({ password: false, cpassword: false })
    const router = useRouter()
    const formik = useFormik({
        initialValues: {
            name : '',
            email: '',
            password: '',
            cpassword: ''
        },
        validate: registerValidate, 
        // validate: () => ({}),
        onSubmit: xsubmit
    })

    async function xsubmit(values){
        console.log('asdfasffsdfasdf')
        // event.preventDefault();
        const userData = {
            name: values.name,
            email: values.email,
            password: values.password
        }
        console.log(values)
        const options = {
            method: "POST",
            headers : { 'Content-Type': 'application/json'},
            body: JSON.stringify(userData)
        }

        await fetch('http://localhost:3000/api/auth/signup', options)
            .then(res =>  res.text())
            .then((data) => {
                
                Promise.resolve(data ? JSON.parse(data) : {})
                // console.log("oooo", data)
                // console.log("aaaaaaaaaaaaaaaaaaa")
                if(data) console.log("---------")
                if(data) router.push('http://localhost:3000/login')
            })
    }

    return (
        <>
            <Head>
                <title>Register</title>
            </Head>

            <div className={styles.container}>
                <div className={styles.register_img}>
                    <div className={styles.register_wrap}>
                        <form method="post" className={styles.register_form} onSubmit={formik.handleSubmit} >
                        <img src="/images/user_img.png" className={styles.user_pfp}></img> 
                            <h1 className={styles.register_header}>Register</h1>
                                
                                <input 
                                    className={styles.input_tab}
                                    type="text"
                                    name='Name'
                                    placeholder='Name'
                                    {...formik.getFieldProps('name')}
                                />
                                <p className={styles.register_error}>{formik.errors.name && formik.touched.name? formik.errors.name : ''}</p>
                                <input 
                                    className={styles.input_tab}
                                    type="email"
                                    name='email'
                                    placeholder='Email'
                                    {...formik.getFieldProps('email')}
                                />
                                <p className={styles.register_error}>{formik.errors.email && formik.touched.email ? formik.errors.email : ''}</p>
                                <input 
                                    className={styles.input_tab}
                                    type={`${show.password ? "text" : "password"}`}
                                    name='password'
                                    placeholder='Password'
                                    {...formik.getFieldProps('password')}
                                />
                                
                                <p className={styles.register_error}>{formik.errors.password && formik.touched.password ? formik.errors.password : ''}</p>
                                
                                
                                    <input 
                                        className={styles.input_tab}
                                        type={`${show.cpassword ? "text" : "password"}`}
                                        name='cpassword'
                                        placeholder='Confirm Password'
                                        
                                        {...formik.getFieldProps('cpassword')}
                                    />
                                    <p className={styles.register_error}>{formik.errors.cpassword && formik.touched.cpassword ? formik.errors.cpassword : ''}</p>
                                
                                
                                <div>
                                    <button  className={styles.register_button} type='submit'>
                                        Register
                                    </button>
                                </div>
                                <p className={styles.register_bottom}>
                                    Have an account? <Link className={styles.no_acc} href={'/login'} >Log In</Link>
                                </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}