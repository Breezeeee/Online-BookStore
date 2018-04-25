import ReactDOM from 'react-dom';
import React, {Component} from'react';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom'
import './css/css.css';
import $ from 'jquery';

import Home from './js/Home';
import BookList from './js/BookList';
import Purchase from './js/Purchase';
import Login from './js/Login'
import Profile from './js/Profile';
import Cart from './js/Cart';
import BookInfo from './js/BookInfo';
import registerServiceWorker from './registerServiceWorker';

let style = {
    backgroundColor: '#8dc63f',
    fontSize: 20,
    fontWeight: 500,
    height: 52,
    padding: '0 3vmin',
    borderRadius: 5,
    color: '#fff'
};

let isLogin = false;
let LoginUid = '';
let setLogin = function (value, Uid) {
    isLogin = value;
    if(isLogin)
        LoginUid = Uid;
};
class LoginButton extends Component {
    render() {
        return (
            isLogin?
            <div className="Link3">
                <Link to={{pathname:"/profile", state:{userid: LoginUid}}} style={style}>Profile</Link>
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
        let uid = "";
        let islogin = false;
        $.ajax({
            url:"/checkstate",
            context:document.body,
            async:false,
            type:"get",
            success: function(data) {
                if(data !== "null") {
                    uid = data;
                    islogin = true;
                }
            }
        });
        if(islogin) {
            setLogin(true, uid);
        }
        else {
            setLogin(false, null);
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
                </div>
            </Router>
        );
    }
}

ReactDOM.render(<OnlineBookStore/>, document.getElementById('root'));
registerServiceWorker();

export {setLogin, isLogin, LoginUid}
