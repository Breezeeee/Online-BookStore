import React , {Component} from 'react';
import { Redirect } from 'react-router-dom';
import '../css/css.css';
import $ from 'jquery';

import {setLogin} from "../index";
import {style} from "./style";

class UserInfo extends Component {

    constructor(props) {
        super(props);
        this.setPassword = this.setPassword.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setPhonenumber = this.setPhonenumber.bind(this);
        let user = null;
        $.ajax({
            url:"/quser",
            context:document.body,
            async:false,
            type:"get",
            success:function(data) {
                if(data !== "null") {
                    user = $.parseJSON(data);
                }
            }
        });
        this.state = {username:user.username, password:user.password, email:user.email, phonenumber:user.phonenumber};
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

    handleModifyClick = () => {
        let new_password = this.state.password;
        let new_email = this.state.email;
        let new_phonenumber = this.state.phonenumber;
        let err = "";
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
                url:"/cuser",
                data:{
                    username:this.state.username,
                    password:new_password,
                    email:new_email,
                    phonenumber:new_phonenumber
                },
                context:document.body,
                async:false,
                type:"get"
            });
            alert("Modify success");
        }
    };

    render() {

        return (
            <div className="Inf">
                <h4>
                    <p className="Header">Username: </p>
                    <p className="Content">{this.state.username}</p>
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
                    <button style={style} onClick={this.handleModifyClick}>Modify</button>
                </div>
            </div>
        );
    }
}

class Profile extends Component {
    constructor() {
        super();
        this.state = {redirect: false};
    }

    handleCancelClick = () => {
        this.setState({redirect: true});
    };

    handleLogoutClick = () => {
        const confirmed = window.confirm('Sure to Logout?');
        if(confirmed) {
            $.ajax({
                url: "/userlogout",
                context: document.body,
                async: false,
                type: "get"
            });
            setLogin(false);
            this.setState({redirect: true});
        }
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
            <div>
                <UserInfo/>
                <div className="Button">
                    <button style={style} onClick={this.handleCancelClick}>Back</button>
                    <button style={style} onClick={this.handleLogoutClick}>Logout</button>
                </div>
            </div>
        );
    }
}

export default Profile;