import React , {Component} from 'react';
import { Redirect, Link} from 'react-router-dom';
import '../css/css.css';
import $ from 'jquery';

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
        if (this.state.redirect) {
            return (
                <Redirect push to="/booklist"/>
            );
        }
        return (
            <div className="LoginFun">
                <div>
                    <div>ID:</div>
                    <input type="text" value={this.state.filterUsername} onChange={this.handleIDChange}/>
                </div>
                <div>
                    <div>Password:</div>
                    <input type="password" value={this.state.filterPassWord} onChange={this.handlePasswordChange}/>
                </div>
                <div>
                    <button onClick={this.handleConfirmClick} className="Button1">Confirm</button>
                    <button onClick={this.handleCancelClick} className="Button2">Cancel</button>
                </div>
                <div className="Link4">
                    <Link to="/signup">New user?</Link>
                </div>
            </div>
        );
    }
}

export default Login;