import ReactDOM from 'react-dom';
import React, {Component} from'react';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom'
import './css/css.css';
import $ from 'jquery';
import {style} from "./js/style";

import Home from './js/Home';
import BookList from './js/BookList';
import Login from './js/Login'
import Profile from './js/Profile';
import Cart from './js/Cart';
import BookInfo from './js/BookInfo';
import Signup from './js/Signup';
import CreateOrder from './js/CreateOrder';
import OrderList from './js/OrderList';
import OrderInfo from './js/OrderInfo';
import Admin from './js/Admin';
import registerServiceWorker from './registerServiceWorker';

let isLogin = false;
let isAdmin = false;
let setLogin = function (value) {
    isLogin = value;
};
let setAdmin = function (value) {
    isAdmin = value;
};
class LoginButton extends Component {
    render() {
        if(!isLogin)
            return(
                <div className="Link3">
                    <Link to="/login" style={style}>Login</Link>
                </div>
            );
        if(!isAdmin)
            return(
                <div className="Link3">
                    <Link to={{pathname:"/profile"}} style={style}>Profile</Link>
                    <Link to={{pathname:"/cart"}} style={style}>Cart</Link>
                    <Link to={{pathname:"/orderlist"}} style={style}>Order</Link>
                </div>
            );
        return (
            <div className="Link3">
                <Link to={{pathname:"/admin"}} style={style}>Manage</Link>
                <Link to={{pathname:"/profile"}} style={style}>Profile</Link>
                <Link to={{pathname:"/cart"}} style={style}>Cart</Link>
                <Link to={{pathname:"/orderlist"}} style={style}>Order</Link>
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
                    <Route path="/login" component={Login}/>
                    <Route path="/profile" component={Profile}/>
                    <Route path="/cart" component={Cart}/>
                    <Route path="/bookinfo" component={BookInfo}/>
                    <Route path="/signup" component={Signup}/>
                    <Route path="/createorder" component={CreateOrder}/>
                    <Route path="/orderlist" component={OrderList}/>
                    <Route path="/orderinfo" component={OrderInfo}/>
                    <Route path="/admin" component={Admin}/>
                </div>
            </Router>
        );
    }
}

ReactDOM.render(<OnlineBookStore/>, document.getElementById('root'));
registerServiceWorker();

export {setLogin, isLogin, setAdmin}
