import React , {Component} from 'react';
import { Redirect } from 'react-router-dom';
import '../css/css.css';

import {UserData} from "../Data/UserData";

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
    constructor(props) {
        super(props);
        this.state = {data: UserData};
    }

    UserProfile = {ID: this.props.UserID, PassWord: '', Name: '', Address: '', PhoneNumber: null};

    render() {
        this.state.data.forEach((user) => {
            if (user.ID === this.UserProfile.ID) {
                this.UserProfile.PassWord = user.PassWord;
                this.UserProfile.Name = user.Name;
                this.UserProfile.Address = user.Address;
                this.UserProfile.PhoneNumber = user.PhoneNumber;
            }
        });
        return (
            <div className="Inf">
                <h4>
                    <p className="Header">ID: </p>
                    <p className="Content">{this.UserProfile.ID}</p>
                </h4>
                <h4>
                    <p className="Header">PassWord: </p>
                    <p className="Content">{this.UserProfile.PassWord}</p>
                </h4>
                <h4>
                    <p className="Header">Name: </p>
                    <p className="Content">{this.UserProfile.Name}</p>
                </h4>
                <h4>
                    <p className="Header">Address: </p>
                    <p className="Content">{this.UserProfile.Address}</p>
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

    render() {
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
                </div>
            </div>
        );
    }
}

export default Profile;