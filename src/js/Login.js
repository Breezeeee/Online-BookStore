import React , {Component} from 'react';
import { Redirect, Link} from 'react-router-dom';
import '../css/css.css';
import $ from 'jquery';
import {Button, Navbar, FormControl} from 'react-bootstrap';

import {setAdmin, setLogin} from "../index";

class Login extends Component {
    constructor() {
        super();
        this.state = {redirect: false, filterUsername: '', filterPassWord: ''};
        this.handleIDChange = this.handleIDChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }
    handleIDChange(e) {
        this.setState({filterUsername:e.target.value});
    }
    handlePasswordChange(e) {
        this.setState({filterPassWord:e.target.value});
    }
    handleConfirmClick = () => {
        let success = 0;
        $.ajax({
            url:"/userlogin",
            data:{
                username:this.state.filterUsername,
                password:this.state.filterPassWord
            },
            context:document.body,
            async:false,
            type:"get",
            success: function(data) {
                if(data !== "null") {
                    if(data === "false")
                        success = 1;
                    else if (data === "admin")
                        success = 3;
                    else
                        success = 2;
                }
            }
        });
        if(success === 2) {
            alert("Login Success !");
            setLogin(true);
            this.setState({redirect: true});
        }
        else if(success === 1)
            alert("The account is banned.");
        else if(success === 3) {
            alert("Login Success !");
            setLogin(true);
            setAdmin(true);
            this.setState({redirect: true});
        }
        else
            alert("Failed, please try again.");
    };
    handleCancelClick = () => {
        this.setState({redirect: true});
    };

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
        if (this.state.redirect) {
            return (
                <Redirect push to="/booklist"/>
            );
        }
        return (
            <div className="LoginFun">
                <div>
                    <a className="Logintext">
                        Login
                    </a>
                    <a className="Link4">
                        <Link to="/signup">New user?</Link>
                    </a>
                </div>
                <div className="LoginInput">
                <Navbar.Form>
                    <FormControl type="text" placeholder="Username" value={this.state.filterUsername} onChange={this.handleIDChange}/>
                </Navbar.Form>
                <Navbar.Form>
                    <FormControl type="password" placeholder="Password" value={this.state.filterPassWord} onChange={this.handlePasswordChange}/>
                </Navbar.Form>
                </div>
                <div>
                    <Button onClick={this.handleConfirmClick} bsStyle="primary" className="Button1">Confirm</Button>
                    <Button onClick={this.handleCancelClick} className="Button2">Cancel</Button>
                </div>
            </div>
        );
    }
}

export default Login;