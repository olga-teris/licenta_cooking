import RecipeCarousel from '../components/recipeCarousel';
import { HomepageCarousel } from '../components/recipeCarousel';
import styles from './index.module.css';
import { getSession, useSession, signOut } from "next-auth/react"
import { IngCarousel } from '../components/recipeCarousel';


import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function Home(props) {

  const { data: session } = useSession()
  // const { data: session} = props.session;


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
    <div className={styles.homepage}>

    <div className={styles.explore_container}> 
      <div className={styles.left1}>
        Explore our recent recipes
        <p className={styles.carousel_description}>Something caught your eye? Check out some of our recent dishes</p>
      </div>
      <div className={styles.right1}>
        <RecipeCarousel/>
      </div>
    </div>

    <div className={styles.explore_container2}> 
      <div className={styles.left2}>
        <HomepageCarousel/>
      </div>
      <div className={styles.right2}>
        Personalize your cooking experience!
        <p className={styles.carousel_description}>Taste the perfect dish you chose!</p>
      </div>
      
    </div>

    <div className={styles.info}>
      <h1>What is Cooking?</h1>
      <p>At its most basic, cooking means applying heat to food. Whether the food is baked, fried, sautéed, boiled, or grilled, it's all cooking. Evidence suggests our ancestors began cooking over an open fire over 2 million years ago. People still cook some foods over an open flame, in addition to using tools like microwaves, toasters, and stovetops.</p><br/>
      <p>In scientific terms, cooking is transferring energy from a heat source to the food. It is as much about the ways ​heat changes the food as it is about the heat itself. That's because heating food does more than just make it hotter.</p>
      <h1>Proteins</h1>
      <p>When you cook an egg, the interior turns from liquid to solid. This is because the proteins in food (like in meats, poultry, and eggs) become firmer when heat is applied. This also why a well-done steak is tougher than one cooked medium-rare.</p><br/>
      <h1>Fruits and Vegetables</h1>
      <p>Cooking food causes other, less obvious, changes, too. Nutrients like vitamins can be destroyed or leached out, literally cooking away. Any time you boil vegetables, some nutrients naturally dissolve into the cooking water or into the air via steam. Conversely, certain vitamins are made available to the body for absorption during cooking, such as thiamin and folate.</p><br/>
      <h1>Safety</h1>
      <p>Some foods are not safe to eat without first being cooked. Cooking not only heats the food, but it can also help kill harmful bacteria. Raw meats are especially prone to carrying bacteria and should be cooked to specific temperatures to ensure they are safe to consume.</p>
    </div>

    <div className={styles.explore_container2}> 
      <div className={styles.left1}>
        Explore recipes by ingredient or type
        <p className={styles.carousel_description}>Knowing your way around a kitchen’s basic ingredients is seriously important – and we’ve split recipes up by their main ingredient.</p>
      </div>
      <div className={styles.right1}>
        <IngCarousel/>
      </div>
    </div>

  </div>
  )
}

// Authorize User
function User({ session, handleSignOut }){
  return(
    <div className={styles.homepage}>

      <div className={styles.explore_container}> 
        <div className={styles.left1}>
          Explore our recent recipes
          <p className={styles.carousel_description}>Something caught your eye? Check out some of our recent dishes</p>
        </div>
        <div className={styles.right1}>
          <RecipeCarousel/>
        </div>
      </div>

      <div className={styles.explore_container2}> 
        <div className={styles.left2}>
          <HomepageCarousel/>
        </div>
        <div className={styles.right2}>
          Personalize your cooking experience!
          <p className={styles.carousel_description}>Taste the perfect dish you chose!</p>
        </div>
        
      </div>

      <div className={styles.info}>
        <h1>What is Cooking?</h1>
        <p>At its most basic, cooking means applying heat to food. Whether the food is baked, fried, sautéed, boiled, or grilled, it's all cooking. Evidence suggests our ancestors began cooking over an open fire over 2 million years ago. People still cook some foods over an open flame, in addition to using tools like microwaves, toasters, and stovetops.</p><br/>
        <p>In scientific terms, cooking is transferring energy from a heat source to the food. It is as much about the ways ​heat changes the food as it is about the heat itself. That's because heating food does more than just make it hotter.</p>
        <h1>Proteins</h1>
        <p>When you cook an egg, the interior turns from liquid to solid. This is because the proteins in food (like in meats, poultry, and eggs) become firmer when heat is applied. This also why a well-done steak is tougher than one cooked medium-rare.</p><br/>
        <h1>Fruits and Vegetables</h1>
        <p>Cooking food causes other, less obvious, changes, too. Nutrients like vitamins can be destroyed or leached out, literally cooking away. Any time you boil vegetables, some nutrients naturally dissolve into the cooking water or into the air via steam. Conversely, certain vitamins are made available to the body for absorption during cooking, such as thiamin and folate.</p><br/>
        <h1>Safety</h1>
        <p>Some foods are not safe to eat without first being cooked. Cooking not only heats the food, but it can also help kill harmful bacteria. Raw meats are especially prone to carrying bacteria and should be cooked to specific temperatures to ensure they are safe to consume.</p>
      </div>

      <div className={styles.explore_container2}> 
        <div className={styles.left1}>
          Explore recipes by ingredient or type
          <p className={styles.carousel_description}>Knowing your way around a kitchen’s basic ingredients is seriously important – and we’ve split recipes up by their main ingredient.</p>
        </div>
        <div className={styles.right1}>
          <IngCarousel/>
        </div>
      </div>

    </div>
    
  )
}


export async function getServerSideProps({ req }){
  const session = await getSession({ req })

   if(!session){
    return {
      redirect : {
        destination: '/login',
        permanent: false
      }
    }
  }


  return {
    props: { session }
  }
}