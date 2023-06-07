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
        validate : login_validate,
        onSubmit
    })

 
    async function onSubmit(values){
        const status = await signIn('credentials', {
            redirect: false,
            email: values.email,
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
        
        {/* <section className='w-3/4 mx-auto flex flex-col gap-10'>
            <div className="title">
                <h1 className='text-gray-800 text-4xl font-bold py-4'>Explore</h1>
                <p className='w-3/4 mx-auto text-gray-400'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, officia?</p>
            </div>


            <form className='flex flex-col gap-5' onSubmit={formik.handleSubmit}>
                <div className={` ${formik.errors.email && formik.touched.email ? 'border-rose-600' : ''}`}>
                    <input 
                    type="email"
                    name='email'
                    placeholder='Email'
                    
                    {...formik.getFieldProps('email')}
                    />
                    <span className='icon flex items-center px-4'>
                       
                    </span>
                   
                </div>
                {formik.errors.email && formik.touched.email ? <span className='text-rose-500'>{formik.errors.email}</span> : <></>}

                <div className={` ${formik.errors.password && formik.touched.password ? 'border-rose-600' : ''}`}>
                    <input 
                    type={`${show ? "text" : "password"}`}
                    name='password'
                    placeholder='password'
                    
                    {...formik.getFieldProps('password')}
                    />
                     <span className='icon flex items-center px-4' onClick={() => setShow(!show)}>
                       
                    </span>
                   
                </div>

                <div className="input-button">
                    <button type='submit'>
                        Login
                    </button>
                </div>
                
            </form>

      
            <p className='text-center text-gray-400 '>
                don't have an account yet? <Link href={'/register'}>Sign Up</Link>
            </p>
        </section> */}
        <div className={styles.container}>
            <div className={styles.login_img}>
                <div className={styles.login_wrap}>
                    <form className={styles.login_form} onSubmit={formik.onSubmit} >
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