import React , {Component} from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Redirect } from 'react-router-dom';
import '../css/css.css';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';
import {setAdmin, setLogin} from "../index";
import $ from "jquery";

class DemoCarousel extends Component {
    constructor() {
        super();
        this.state = {redirect:false, book_id:""};
    }
    handleImg1Click = () => {
        this.setState({redirect:true, book_id:"f5374fed26ae4540"});
    };
    handleImg2Click = () => {
        this.setState({redirect:true, book_id:"1e42c0234fe74305"});
    };
    render() {
        if(this.state.redirect) {
            return(
                <Redirect to={{pathname:"/bookinfo", state:{bookid:this.state.book_id}}}/>
            );
        }
        return (
            <Carousel autoPlay style={styles} showThumbs={false} infiniteLoop={true} interval={3000}>
                <div>
                    <img alt="page1" src={require("../img/page1.jpg")}/>
                </div>
                <div>
                    <img alt="page2" src={require("../img/page2.jpg")}/>
                </div>
            </Carousel>
        );
    }
}

class Home extends Component {
    render() {
        let islogin = false;
        let isAdmin = false;
        $.ajax({
            url:"/checkstate",
            context:document.body,
            async:false,
            type:"get",
            success: function(data) {
                if(data !== "null") {
                    islogin = true;
                }
                if(data === "admin") {
                    isAdmin = true;
                }
            }
        });
        if(islogin) {
            setLogin(true);
        }
        else {
            setLogin(false);
        }
        if(isAdmin) {
            setAdmin(true);
        }
        else {
            setAdmin(false);
        }
        return (
            <div>
                <h2 className="Recommend">Recommend !</h2>
                <DemoCarousel />
            </div>
        );
    }
}

export default Home;