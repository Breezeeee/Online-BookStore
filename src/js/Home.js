import React , {Component} from 'react';
import { Carousel } from 'react-responsive-carousel';
import '../css/css.css';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

class DemoCarousel extends Component {
    render() {
        return (
            <Carousel autoPlay style={styles} showThumbs={false} infiniteLoop={true} interval={3000}>
                <div>
                    <img alt="page1" src={require("../img/page1.jpg")} />
                </div>
                <div>
                    <img alt="page2" src={require("../img/page2.jpg")} />
                </div>
            </Carousel>
        );
    }
}

class Home extends Component {
    render() {
        return (
            <div>
                <h2 className="Recommend">Recommend !</h2>
                <DemoCarousel />
            </div>
        );
    }
}

export default Home;