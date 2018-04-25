import React , {Component} from 'react';
import { Redirect } from 'react-router-dom';
import '../css/css.css';
import $ from 'jquery';

import {setLogin} from "../index";

let style = {
    backgroundColor: '#8dc63f',
    fontSize: 20,
    fontWeight: 500,
    height: 52,
    padding: '0 3vmin',
    borderRadius: 5,
    color: '#fff'
};

class UserInfo extends Component {

    UserProfile = {PassWord: '', Username: '', Email: '', PhoneNumber: 0};

    render() {
        let user = null;
        $.ajax({
            url:"/quser",
            data:{
                id:this.props.UserID
            },
            context:document.body,
            async:false,
            type:"get",
            success:function(data) {
                if(data !== "null") {
                    user = $.parseJSON(data);
                }
            }
        });
        this.UserProfile.PassWord = user.password;
        this.UserProfile.Username = user.username;
        this.UserProfile.Email = user.email;
        this.UserProfile.PhoneNumber = user.phonenumber;

        return (
            <div className="Inf">
                <h4>
                    <p className="Header">Username: </p>
                    <p className="Content">{this.UserProfile.Username}</p>
                </h4>
                <h4>
                    <p className="Header">PassWord: </p>
                    <p className="Content">{this.UserProfile.PassWord}</p>
                </h4>
                <h4>
                    <p className="Header">Email: </p>
                    <p className="Content">{this.UserProfile.Email}</p>
                </h4>
                <h4>
                    <p className="Header">PhoneNumber: </p>
                    <p className="Content">{this.UserProfile.PhoneNumber}</p>
                </h4>
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
            setLogin(false, null);
            this.setState({redirect: true});
        }
    };

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
        if (this.state.redirect) {
            return (
                <Redirect push to="/booklist"/>
            );
        }
        return (
            <div>
                <UserInfo UserID={this.props.location.state.userid}/>
                <div className="Button">
                    <button style={style} onClick={this.handleCancelClick}>Back</button>
                    <button style={style} onClick={this.handleLogoutClick}>Logout</button>
                </div>
            </div>
        );
    }
}

export default Profile;