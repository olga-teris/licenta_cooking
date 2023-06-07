import Head from 'next/head';
import styles from './index.module.css';
import { getSession, useSession, signOut } from "next-auth/react"
import Link from 'next/link'

export default function Home() {

  const { data: session } = useSession()

  function handleSignOut(){
    signOut()
  }

  return (
    <div>
      {session ? User({ session, handleSignOut }) : Guest()}
    </div>
  )
}

// Guest
function Guest(){
  return (
    // <main className="container mx-auto text-center py-20">
    //       <h3 className='text-4xl font-bold'>Guest Homepage</h3>

    //       <div className='flex justify-center'>
    //         <Link href={'/login'}>Sign In</Link>
    //       </div>
    //   </main>
    <div className={styles.homepage}>
      <div className={styles.homepageLeft}>
        
          <div className={styles.title}>Recipes</div>
          <div className={styles.description}>Although coral and navy are fairly strong colors, they are softened by the serene hues of grey, lilac and pale pinks. This is a clever color scheme for a meditation app because although it is calming, it is also confident (red) and reliable (blue), which together are pretty apt for services centred around mental health and well-being.</div>
          <div>
            <button className={styles.button}>Get Started</button>
          </div>
        
      </div>
      <div className={styles.homepageRight}>
        <img src="/images/food.jpg" className={styles.img}></img>
      </div>
    </div>
  )
}

// Authorize User
function User({ session, handleSignOut }){
  return(
    <main className="container mx-auto text-center py-20">
          <h3 className='text-4xl font-bold'>Authorize User Homepage</h3>

          <div className='details'>
            <h5>{session.user.name}</h5>
            <h5>{session.user.email}</h5>
          </div>

          <div className="flex justify-center">
            <button onClick={handleSignOut} className='mt-5 px-10 py-1 rounded-sm bg-indigo-500 bg-gray-50'>Sign Out</button>
          </div>

          <div className='flex justify-center'>
            <Link href={'/profile'}>Profile Page</Link>
          </div>
      </main>
  )
}


export async function getServerSideProps({ req }){
  const session = await getSession({ req })

  // if(!session){
  //   return {
  //     redirect : {
  //       destination: '/login',
  //       permanent: false
  //     }
  //   }
  // }

  return {
    props: { session }
  }
}