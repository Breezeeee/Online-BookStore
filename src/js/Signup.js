import React , {Component} from 'react';
import { Redirect } from 'react-router-dom';
import '../css/css.css';
import $ from 'jquery';
import {style} from "./style";
import {setLogin} from "../index";

class Signup extends Component {
    constructor() {
        super();
        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setPhonenumber = this.setPhonenumber.bind(this);
        this.state = {username:"", password:"", email:"", phonenumber:"", redirect: false};
    }
    setUsername(e) {
        this.setState({username : e.target.value});
    }
    setPassword(e) {
        this.setState({password : e.target.value});
    }
    setEmail(e) {
        this.setState({email : e.target.value});
    }
    setPhonenumber(e) {
        this.setState({phonenumber : e.target.value});
    }

    handleCancelClick = () => {
        this.setState({redirect: true});
    };
    handleSignupClick = () => {
        let new_username = this.state.username;
        let new_password = this.state.password;
        let new_email = this.state.email;
        let new_phonenumber = this.state.phonenumber;
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
                    err += "username already exists\n";
                }
            }
        });
        let p_valid = 0;
        for(let i = 0; i < new_password.length; i++) {
            if(new_password.charAt(i) > '0' && new_password.charAt(i) < '9') {
                if(p_valid === 0)
                    p_valid = 1;
                if(p_valid === 2) {
                    p_valid = 3;
                    break;
                }
            }
            if((new_password.charAt(i) > 'a' && new_password.charAt(i) < 'z') || (new_password.charAt(i) > 'A' && new_password.charAt(i) < 'Z')) {
                if(p_valid === 0)
                    p_valid = 2;
                if(p_valid === 1) {
                    p_valid = 3;
                    break;
                }
            }
        }
        if(p_valid !== 3) {
            err += "password must contain both letters and numbers\n";
        }
        let re2 = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if(!re2.test(new_email)) {
            err += "invalid email format\n";
        }
        let re3=/^(1+\d{10})$/;
        if(!re3.test(new_phonenumber)) {
            err += "invalid phonenumber";
        }
        if(err !== "") {
            alert(err);
        }
        else {
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
            <div className="Inf">
                <h4>
                    <p className="Header">Username(Can't change later): </p>
                    <input className="ContentInput" type="text" value={this.state.username} onChange={this.setUsername}/>
                </h4>
                <h4>
                    <p className="Header">PassWord: </p>
                    <input className="ContentInput" type="password" value={this.state.password} onChange={this.setPassword}/>
                </h4>
                <h4>
                    <p className="Header">Email: </p>
                    <input className="ContentInput" type="text" value={this.state.email} onChange={this.setEmail}/>
                </h4>
                <h4>
                    <p className="Header">PhoneNumber: </p>
                    <input className="ContentInput" type="text" value={this.state.phonenumber} onChange={this.setPhonenumber}/>
                </h4>
                <div className="Button3">
                    <button style={style} onClick={this.handleSignupClick}>Signup</button>
                    <button style={style} onClick={this.handleCancelClick}>Cancel</button>
                </div>
            </div>
        );
    }
}

export default Signup;