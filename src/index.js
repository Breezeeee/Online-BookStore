import ReactDOM from 'react-dom';
import React, {Component} from'react';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom'
import './css/css.css';
import $ from 'jquery';
import {Button, ButtonToolbar, Col} from 'react-bootstrap';

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
                <Button  bsStyle="link" className="Link3">
                    <Link to="/login">Login</Link>
                </Button>
            );
        if(!isAdmin)
            return(
                <ButtonToolbar className="Link3">
                    <Button bsStyle="link">
                        <Link to={{pathname:"/profile"}}>Profile</Link>
                    </Button>
                    <Button bsStyle="link">
                        <Link to={{pathname:"/cart"}}>Cart</Link>
                    </Button>
                    <Button bsStyle="link">
                        <Link to={{pathname:"/orderlist"}}>Order</Link>
                    </Button>
                </ButtonToolbar>
            );
        return (
            <ButtonToolbar className="Link3">
                <Button bsStyle="link">
                    <Link to={{pathname:"/admin"}}>Manage</Link>
                </Button>
                <Button bsStyle="link">
                    <Link to={{pathname:"/profile"}}>Profile</Link>
                </Button>
                <Button bsStyle="link">
                    <Link to={{pathname:"/cart"}}>Cart</Link>
                </Button>
                <Button bsStyle="link">
                    <Link to={{pathname:"/orderlist"}}>Order</Link>
                </Button>
            </ButtonToolbar>
        );
    }
}

class OnlineBookStore extends Component {
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
            <Router>
                <div>
                    <div>
                        <h1 className="title">Online Bookstore</h1>
                    </div>
                    <div>
                        <ButtonToolbar>
                            <Col md={2} mdOffset={1}>
                                <Button bsStyle="link"><Link to="/" className="Link1">Home</Link></Button>
                                <Button bsStyle="link"><Link to="/booklist" className="Link2">BookList</Link></Button>
                            </Col>
                            <Col md={4} mdOffset={5}>
                                <LoginButton/>
                            </Col>

                        </ButtonToolbar>
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
