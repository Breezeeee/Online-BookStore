import React , {Component} from 'react';
import { Redirect } from 'react-router-dom';
import '../css/css.css';
import $ from 'jquery';

import {setLogin} from "../index";
import {style} from "./style";

class ItemRow extends Component {
    render() {
        const item = this.props.item;
        const bname = item.bname;
        const bauthor = item.bauthor;
        const price = (Number(item.price) / 100).toFixed(2);
        const num = item.num;
        const subtotal = (Number(item.subtotal) / 100).toFixed(2);
        return(
            <tr>
                <td>{bname}</td>
                <td>{bauthor}</td>
                <td>{price}</td>
                <td>{num}</td>
                <td>{subtotal}</td>
            </tr>
        );
    }
}

class SubItem extends Component {
    render() {
        let Items = null;
        $.ajax({
            url:"/qorder2",
            data:{
                id:this.props.oid
            },
            context:document.body,
            async:false,
            type:"get",
            success: function(data) {
                Items = $.parseJSON(data);
            }
        });
        const rows = [];
        Items.forEach((item) => {
            rows.push(<ItemRow item={item}/>);
        });
        return(
            <tbody>{rows}</tbody>
        )
    }
}

class Information extends Component {
    render() {
        let order = null;
        const OrderID = this.props.OrderID;
        $.ajax({
            url:"/qorder3",
            data:{
                id:OrderID
            },
            context:document.body,
            async:false,
            type:"get",
            success:function(data) {
                order = $.parseJSON(data);
            }
        });
        const address = order.address;
        const date = order.date;
        const total = (Number(order.total) / 100).toFixed(2);

        return (
            <div>
                <div className="OrderInf">
                    <h4>
                        <p className="Header">OrderID: </p>
                        <p className="Content">{OrderID}</p>
                    </h4>
                    <h4>
                        <p className="Header">Date: </p>
                        <p className="Content">{date}</p>
                    </h4>
                    <h4>
                        <p className="Header">Address: </p>
                        <p className="Content">{address}</p>
                    </h4>
                    <h4>
                        <p className="Header">Total: </p>
                        <p className="Content">{total}</p>
                    </h4>
                </div>
                <table>
                    <th>Book</th>
                    <th>Author</th>
                    <th>Price</th>
                    <th>Number</th>
                    <th>SubTotal</th>
                    <SubItem oid={OrderID}/>
                </table>
            </div>
        );
    }
}

class OrderInfo extends Component {
    constructor() {
        super();
        this.state = {redirect: false};
    }

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
                <Redirect push to="/orderlist"/>
            );
        }
        return (
            <div>
                <Information OrderID={this.props.location.state.oid}/>
                <div className="Button">
                    <button style={style} onClick={this.handleCancelClick}>Back</button>
                </div>
            </div>
        );
    }
}

export default OrderInfo;