import ReactDOM from 'react-dom';
import React, {Component} from'react';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom'
import './css/css.css';
import $ from 'jquery';
import {style} from "./js/style";

import Home from './js/Home';
import BookList from './js/BookList';
import Purchase from './js/Purchase';
import Login from './js/Login'
import Profile from './js/Profile';
import Cart from './js/Cart';
import BookInfo from './js/BookInfo';
import Signup from './js/Signup';
import CreateOrder from './js/CreateOrder';
import registerServiceWorker from './registerServiceWorker';

let isLogin = false;
let setLogin = function (value) {
    isLogin = value;
};
class LoginButton extends Component {
    render() {
        return (
            isLogin?
            <div className="Link3">
                <Link to={{pathname:"/profile"}} style={style}>Profile</Link>
                <Link to={{pathname:"/cart"}} style={style}>Cart</Link>
            </div>
            :
            <div className="Link3">
                <Link to="/login" style={style}>Login</Link>
            </div>
        );
    }
}

class OnlineBookStore extends Component {
    render() {
        let islogin = false;
        $.ajax({
            url:"/checkstate",
            context:document.body,
            async:false,
            type:"get",
            success: function(data) {
                if(data !== "null") {
                    islogin = true;
                }
            }
        });
        if(islogin) {
            setLogin(true);
        }
        else {
            setLogin(false);
        }
        return (
            <Router>
                <div>
                    <div>
                        <h1 className="title">Online Bookstore</h1>
                        <LoginButton/>
                    </div>
                    <div>
                        <Link to="/" style={style} className="Link1">Home</Link>
                        <Link to="/booklist" style={style} className="Link2">BookList</Link>
                    </div>
                    <hr/>
                    <Route  exact path="/" component={Home}/>
                    <Route path="/booklist" component={BookList}/>
                    <Route path="/purchase" component={Purchase}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/profile" component={Profile}/>
                    <Route path="/cart" component={Cart}/>
                    <Route path="/bookinfo" component={BookInfo}/>
                    <Route path="/signup" component={Signup}/>
                    <Route path="/createorder" component={CreateOrder}/>
                </div>
            </Router>
        );
    }
}

ReactDOM.render(<OnlineBookStore/>, document.getElementById('root'));
registerServiceWorker();

export {setLogin, isLogin}
