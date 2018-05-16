import React , {Component} from 'react';
import { Redirect, Link } from 'react-router-dom';
import '../css/css.css';
import $ from 'jquery';
import {Button} from 'react-bootstrap';
import {setLogin} from "../index";

class Signup extends Component {
    constructor() {
        super();
        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.setPassword2 = this.setPassword2.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setPhonenumber = this.setPhonenumber.bind(this);
        this.testUsername = this.testUsername.bind(this);
        this.testPassword = this.testPassword.bind(this);
        this.testPassword2 = this.testPassword2.bind(this);
        this.testEmail = this.testEmail.bind(this);
        this.testPhonenumber = this.testPhonenumber.bind(this);
        this.state = {username:"", password:"", password2:"", email:"", phonenumber:"", err:0, redirect: false};
    }
    setUsername(e) {
        this.setState({username : e.target.value});
    }
    setPassword(e) {
        this.setState({password : e.target.value});
    }
    setPassword2(e) {
        this.setState({password2 : e.target.value});
    }
    setEmail(e) {
        this.setState({email : e.target.value});
    }
    setPhonenumber(e) {
        this.setState({phonenumber : e.target.value});
    }
    testUsername() {
        let new_username = this.state.username;
        let err = "";
        $.ajax({
            url:"/checkusername",
            data:{
                username:new_username
            },
            context:document.body,
            async:false,
            type:"get",
            success: function(data) {
                if(data === "false") {
                    err = "username already exists";
                }
            }
        });
        if(err !== "") {
            alert(err);
            if(this.state.err === 0)
                this.setState({err:1});
        }
        else {
            if(this.state.err === 1)
                this.setState({err:0});
        }
    }
    testPassword() {
        let new_password = this.state.password;
        if(new_password.length < 8) {
            alert("Password must contain at least 8 letters.");
            if(this.state.err === 0)
                this.setState({err:2});
        }
        else {
            if(this.state.err === 2)
                this.setState({err:0});
            let p_valid = 0;
            for (let i = 0; i < new_password.length; i++) {
                if (new_password.charAt(i) >= '0' && new_password.charAt(i) <= '9') {
                    if (p_valid === 0)
                        p_valid = 1;
                    if (p_valid === 2) {
                        p_valid = 3;
                        break;
                    }
                }
                if ((new_password.charAt(i) >= 'a' && new_password.charAt(i) <= 'z') || (new_password.charAt(i) >= 'A' && new_password.charAt(i) <= 'Z')) {
                    if (p_valid === 0)
                        p_valid = 2;
                    if (p_valid === 1) {
                        p_valid = 3;
                        break;
                    }
                }
            }
            if (p_valid !== 3) {
                alert("password must contain both letters and numbers");
                if(this.state.err === 0)
                    this.setState({err:3});
            }
            else {
                if(this.state.err === 3)
                    this.setState({err:0});
            }
        }
    }
    testPassword2() {
        let new_password = this.state.password;
        let new_password2 = this.state.password2;
        if(new_password !== new_password2) {
            alert("two password must be the same.");
            if(this.state.err === 0)
                this.setState({err:4});
        }
        else {
            if(this.state.err === 4)
                this.setState({err:0});
        }
    }
    testEmail() {
        let new_email = this.state.email;
        let re2 = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if(!re2.test(new_email)) {
            alert("invalid email format");
            if(this.state.err === 0)
                this.setState({err:5});
        }
        else {
            if(this.state.err === 5)
                this.setState({err:0});
        }
    }
    testPhonenumber() {
        let new_phonenumber = this.state.phonenumber;
        let re3=/^(1+\d{10})$/;
        if(!re3.test(new_phonenumber)) {
            alert("invalid phonenumber");
            if(this.state.err === 0)
                this.setState({err:6});
        }
        else {
            if(this.state.err === 6)
                this.setState({err:0});
        }
    }
    handleCancelClick = () => {
        this.setState({redirect: true});
    };
    handleSignupClick = () => {
        let err = this.state.err;
        if(err !== 0) {
            if(err === 1)
                alert("username already exists");
            if(err === 2)
                alert("Password must contain at least 8 letters.");
            if(err === 3)
                alert("password must contain both letters and numbers");
            if(err === 4)
                alert("two password must be the same.");
            if(err === 5)
                alert("invalid email format");
            if(err === 6)
                alert("invalid phonenumber");
        }
        else {
            let new_username = this.state.username;
            let new_password = this.state.password;
            let new_email = this.state.email;
            let new_phonenumber = this.state.phonenumber;
            $.ajax({
                url:"/saveuser",
                data:{
                    username:new_username,
                    password:new_password,
                    email:new_email,
                    phonenumber:new_phonenumber
                },
                context:document.body,
                async:false,
                type:"get"
            });
            alert("Signup success");
            $.ajax({
                url:"/userlogin",
                data:{
                    username:new_username,
                    password:new_password
                },
                context:document.body,
                async:false,
                type:"get"
            });
            setLogin(true);
            this.setState({redirect:true});
        }
    };

    render() {
        if(this.state.redirect) {
            return(
                <Redirect push to="/booklist"/>
            );
        }
        return (
            <div className="LoginFun">
                <div>
                    <a className="Logintext">
                        Sign up
                    </a>
                    <a className="Link4">
                        <Link to="/login">Have account?</Link>
                    </a>
                </div>
                <div className="LoginInput">
                    <input placeholder="Username" type="text" value={this.state.username} onChange={this.setUsername} onBlur={this.testUsername}/>
                </div>
                <div className="LoginInput">
                    <input placeholder="Password" type="password" value={this.state.password} onChange={this.setPassword} onBlur={this.testPassword}/>
                </div>
                <div className="LoginInput">
                    <input placeholder="ConfirmPassword" type="password" value={this.state.password2} onChange={this.setPassword2} onBlur={this.testPassword2}/>
                </div>
                <div className="LoginInput">
                    <input placeholder="Email" type="text" value={this.state.email} onChange={this.setEmail} onBlur={this.testEmail}/>
                </div>
                <div className="LoginInput">
                    <input placeholder="PhoneNumber" type="text" value={this.state.phonenumber} onChange={this.setPhonenumber} onBlur={this.testPhonenumber}/>
                </div>
                <div className="Button3">
                    <Button onClick={this.handleSignupClick} bsStyle="primary" className="Button1">Signup</Button>
                    <Button onClick={this.handleCancelClick} className="Button2">Cancel</Button>
                </div>
            </div>
        );
    }
}

export default Signup;