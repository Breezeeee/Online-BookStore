import React , {Component} from 'react';
import { Redirect } from 'react-router-dom';
import '../css/css.css';

import {setLogin} from "../index";
import {UserData} from '../Data/UserData';

class Login extends Component {
    constructor() {
        super();
        this.state = {redirect: false, filterID: '', filterPassWord: ''};
        this.handleIDChange = this.handleIDChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }
    handleIDChange(e) {
        this.setState({filterID:e.target.value});
    }
    handlePasswordChange(e) {
        this.setState({filterPassWord:e.target.value});
    }
    handleConfirmClick = () => {
        let success = false;
        UserData.forEach((user) => {
            if (user.ID === this.state.filterID && user.PassWord === this.state.filterPassWord) {
                success = true;
            }
        });
        if(success) {
            alert("Login Success !");
            setLogin(true, this.state.filterID);
            this.setState({redirect: true});
        }
        else {
            alert("Failed, please try again.");
        }
    };
    handleCancelClick = () => {
        this.setState({redirect: true});
    };

    render() {
        if (this.state.redirect) {
            return (
                <Redirect push to="/booklist"/>
            );
        }
        return (
            <div className="LoginFun">
                <div>
                    <div>ID:</div>
                    <input type="text" value={this.state.filterID} onChange={this.handleIDChange}/>
                </div>
                <div>
                    <div>Password:</div>
                    <input type="text" value={this.state.filterPassWord} onChange={this.handlePasswordChange}/>
                </div>
                <div>
                    <button onClick={this.handleConfirmClick} className="Button1">Confirm</button>
                    <button onClick={this.handleCancelClick} className="Button2">Cancel</button>
                </div>
            </div>
        );
    }
}

export default Login;