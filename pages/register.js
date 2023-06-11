import Head from 'next/head'
import Layout from '../components/layout';
import Link from 'next/link'

import Image from 'next/image'

import { useState } from 'react';
import { useFormik } from 'formik';
import { registerValidate } from '../lib/validate'
import { useRouter } from 'next/router';

export default function Register(){

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [show, setShow] = useState({ password: false, cpassword: false })
    const router = useRouter()
    // const formik = useFormik({
    //     initialValues: {
    //         username : '',
    //         email: '',
    //         password: '',
    //         cpassword: ''
    //     },
    //     validate: registerValidate, 
    //     onSubmit
    // })

    async function handleSubmit(event){
        event.preventDefault();
        const values = {
            name: name,
            email: email,
            password: password
        }
        // console.log(values)
        const options = {
            method: "POST",
            headers : { 'Content-Type': 'application/json'},
            body: JSON.stringify(values)
        }

        await fetch('http://localhost:3000/api/auth/signup', options)
            .then(res =>  res.text())
            .then((data) => {
                
                Promise.resolve(data ? JSON.parse(data) : {})
                console.log("oooo", data)
                console.log("aaaaaaaaaaaaaaaaaaa")
                if(data) console.log("---------")
                if(data) router.push('http://localhost:3000/login')
            })
        // const response = await fetch('http://localhost:3000/api/auth/signup', options);
        // const result = await response.json();
        // if(result){
        //     router.push('http://localhost:3000/login')
        // }
    }

    return (
        <>
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <label>
                    Username: <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                
                <label>
                    Email: <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                    Password: <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <button type='submit'>Register User</button>

                <Link href='/register'>Register</Link>
            </form>

        {/* <Head>
            <title>Register</title>
        </Head>

        <section className='w-3/4 mx-auto flex flex-col gap-10'>
            <div className="title">
                <h1 className='text-gray-800 text-4xl font-bold py-4'>Register</h1>
                <p className='w-3/4 mx-auto text-gray-400'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, officia?</p>
            </div>

            <form className='flex flex-col gap-5' onSubmit={formik.handleSubmit}>
                <div className={`${formik.errors.username && formik.touched.username ? 'border-rose-600' : ''}`}>
                    <input 
                    type="text"
                    name='Username'
                    placeholder='Username'
                    
                    {...formik.getFieldProps('username')}
                    />
                    <span className='icon flex items-center px-4'>
                        
                    </span>
                </div>
                <div className={`${formik.errors.email && formik.touched.email ? 'border-rose-600' : ''}`}>
                    <input 
                    type="email"
                    name='email'
                    placeholder='Email'
                    
                    {...formik.getFieldProps('email')}
                    />
                    <span className='icon flex items-center px-4'>
                        
                    </span>
                </div>
                <div className={`${formik.errors.password && formik.touched.password ? 'border-rose-600' : ''}`}>
                    <input 
                    type={`${show.password ? "text" : "password"}`}
                    name='password'
                    placeholder='password'
                    
                    {...formik.getFieldProps('password')}
                    />
                     <span className='icon flex items-center px-4' onClick={() => setShow({ ...show, password: !show.password})}>
                        
                    </span>
                </div>
                

                <div className={`${formik.errors.cpassword && formik.touched.cpassword ? 'border-rose-600' : ''}`}>
                    <input 
                    type={`${show.cpassword ? "text" : "password"}`}
                    name='cpassword'
                    placeholder='Confirm Password'
                    
                    {...formik.getFieldProps('cpassword')}
                    />
                     <span className='icon flex items-center px-4' onClick={() => setShow({ ...show, cpassword: !show.cpassword})}>
                        
                    </span>
                </div>

                <div className="input-button">
                    <button type='submit'>
                        Sign Up
                    </button>
                </div>
            </form>

            <p className='text-center text-gray-400 '>
                Have an account? <Link href={'/login'} >Sign In</Link>
            </p>
        </section> */}
        

        </>
    )
}