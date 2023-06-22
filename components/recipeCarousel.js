import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from './recipeCarousel.module.css'

export default function RecipeCarousel(){
    return (
        
        <Carousel autoPlay infiniteLoop={true} interval="3000" transitionTime="2000" width='600px' showThumbs={false} >
                <div>
                    <img className={styles.image} src="/images/beef_stew.jpg" />
                    <p className="legend">Beef Stew</p>
                </div>
                <div>
                    <img className={styles.image} src="/images/blueberry_loaf.jpg" />
                    <p className="legend">Blueberry Loaf</p>
                </div>
                <div>
                    <img className={styles.image} src="/images/pumpkin_soup.jpg" />
                    <p className="legend">Pumpkin Soup</p>
                </div>
          </Carousel>
    )
}

export function HomepageCarousel(){
    return (
        
        <Carousel infiniteLoop={true} autoPlay interval="3000" transitionTime="2000" width='600px' showThumbs={false} >
                <div>
                    <img className={styles.image} src="/images/homepage4.jpg" />
                    <p className="legend">Explore</p>
                </div>
               
                <div>
                    <img className={styles.image} src="/images/homepage1.png" />
                    <p className="legend">Get Started</p>
                </div>
                <div>
                    <img className={styles.image} src="/images/homepage2.png" />
                    <p className="legend">Explore</p>
                </div>
                <div>
                    <img className={styles.image} src="/images/homepage3.jpg" />
                    <p className="legend">Explore</p>
                </div>
               
          </Carousel>
    )
}

export function IngCarousel(){
    return (
        
        <Carousel autoPlay infiniteLoop={true} interval="3000" transitionTime="2000" width='600px' showThumbs={false} >
                <div>
                    <img className={styles.image} src="/images/beef.jpg" />
                    <p className="legend">Beef</p>
                </div>
                <div>
                    <img className={styles.image} src="/images/vegetables.png" />
                    <p className="legend">Vegetables</p>
                </div>
                <div>
                    <img className={styles.image} src="/images/chicken.jpg" />
                    <p className="legend">Chicken</p>
                </div>
                <div>
                    <img className={styles.image} src="/images/dessert.jpg" />
                    <p className="legend">Dessert</p>
                </div>
                
          </Carousel>
    )
}