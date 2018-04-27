import React , {Component} from 'react';
import { Redirect } from 'react-router-dom';
import '../css/css.css';
import $ from 'jquery';

import {style} from "./style";

class CartRow extends  Component {
    constructor(props) {
        super(props);
        this.delBook = this.delBook.bind(this);
        this.setAmount = this.setAmount.bind(this);
        this.state = {amount: this.props.book.num};
    }
    Book = {name:"", bid:"", price:0, stock:0, num:0, subtotal:0};
    delBook() {
        $.ajax({
            url:"/ditem",
            data:{
                bid:this.Book.bid
            },
            context:document.body,
            async:false,
            type:"get"
        });
        window.location.reload();
    }
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
                <td className="t4">
                    <button style={style} onClick={this.delBook}>delete</button>
                </td>
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
        this.state = {redirect: false, redirect2: false};
    }

    handleCreateOrderClick = () => {
        this.setState({redirect2: true});
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
        if (this.state.redirect2) {
            return(
                <Redirect push to="/createorder"/>
            );
        }
        return (
            <div>
                <CartList/>
                <div className="Button">
                    <button style={style} onClick={this.handleCreateOrderClick}>Create Order</button>
                    <button style={style} onClick={this.handleCancelClick}>Back to BookList</button>
                </div>
            </div>
        );
    }
}

export default Cart;