import React , {Component} from 'react';
import { Redirect } from 'react-router-dom';
import '../css/css.css';
import $ from 'jquery';

import {LoginUid} from "../index";

let style = {
    backgroundColor: '#8dc63f',
    fontSize: 20,
    fontWeight: 500,
    height: 52,
    padding: '0 3vmin',
    borderRadius: 5,
    color: '#fff'
};

class CartRow extends  Component {
    constructor(props) {
        super(props);
        this.setAmount = this.setAmount.bind(this);
        this.state = {amount: this.props.book.num};
    }
    Book = {name:"", bid:"", price:0, stock:0, num:0, subtotal:0};
    setAmount(e) {
        let flag = true;
        let want_amount = e.target.value;
        for(let i = 0; i < want_amount.length; i++) {
            if(want_amount.charAt(i) < '0' || want_amount.charAt(i) > '9')
                flag = false;
        }
        if(!flag)
            want_amount = this.state.amount;
        let book_left = this.Book.stock;
        if(want_amount > book_left) {
            want_amount = book_left;
            e.target.value = want_amount;
        }
        if(want_amount === "" || want_amount === 0) {
            want_amount = 1;
            e.target.value = want_amount;
        }
        this.setState({amount: want_amount});
        $.ajax({
            url:"/citem",
            data:{
                uid:LoginUid,
                bid:this.Book.bid,
                num:want_amount
            },
            context:document.body,
            async:true,
            type:"get"
        });
        this.Book.subtotal = (this.state.amount * this.Book.price / 100).toFixed(2);
        window.location.reload();
    };

    render() {
        const book = this.props.book;
        this.Book.name = book.bname;
        this.Book.bid = book.bid;
        this.Book.price = (Number(book.price) / 100).toFixed(2);
        this.Book.num = Number(book.num);
        this.Book.subtotal = (Number(book.price) * Number(book.num) /100).toFixed(2);
        this.Book.stock= Number(book.stock);
        return(
            <tr>
                <td>{this.Book.name}</td>
                <td>{this.Book.price}</td>
                <td>
                    <input id={this.Book.bid} type="number" placeholder={this.Book.num} value={this.state.amount} onChange={this.setAmount}/>
                </td>
                <td>{this.Book.subtotal}</td>
            </tr>
        );
    }
}

class CartList extends Component {

    render() {
        const rows = [];
        let books = null;
        $.ajax({
            url:"/qcart",
            data:{
                uid:LoginUid
            },
            context:document.body,
            async:false,
            type:"get",
            success:function(data) {
                if(data !== "null") {
                    books = $.parseJSON(data);
                }
            }
        });
        books.forEach(book => {
            rows.push(<CartRow book={book}/>)
        });
        return (
            <table>
                <thead>
                <tr>
                    <th className="t1">Book</th>
                    <th className="t4">Price</th>
                    <th className="t4">Amount</th>
                    <th className="t4">SubTotal</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
}

class Cart extends Component {
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
                <CartList/>
                <div className="Button">
                    <button style={style} onClick={this.handleCancelClick}>Back to BookList</button>
                </div>
            </div>
        );
    }
}

export default Cart;