import React , {Component} from 'react';
import { Redirect } from 'react-router-dom';
import '../css/css.css';

import {CartData} from "../Data/CartData";

let style = {
    backgroundColor: '#8dc63f',
    fontSize: 20,
    fontWeight: 500,
    height: 52,
    padding: '0 3vmin',
    borderRadius: 5,
    color: '#fff'
};
let style2 = {
    backgroundColor: '#8dc63f',
    fontSize: 20,
    fontWeight: 300,
    height: 30,
    padding: '0 1vmin',
    borderRadius: 5,
    color: '#fff'
};
class CartRow extends  Component {
    constructor(props) {
        super(props);
        this.setAmount = this.setAmount.bind(this);
        this.Add = this.Add.bind(this);
        this.Minus = this.Minus.bind(this);
        this.state = {amount: this.props.book.num};
    }
    Add() {
        let num = document.getElementById("numwant");
        let want_amount = parseInt(num.value) + 1;
        let book_left = this.props.book.Left;
        if(want_amount > book_left)
            want_amount = book_left;
        this.setState({amount: want_amount});
        num.value = want_amount;
    }
    Minus() {
        let num = document.getElementById("numwant");
        let want_amount = parseInt(num.value) - 1;
        if(want_amount === 0)
            want_amount = 1;
        this.setState({amount: want_amount});
        num.value = want_amount;
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
        let book_left = this.props.book.Left;
        if(want_amount > book_left) {
            want_amount = book_left;
            e.target.value = want_amount;
        }
        if(want_amount === "") {
            want_amount = 1;
            e.target.value = want_amount;
        }
        this.setState({amount: want_amount});
    };
    render() {
        const book = this.props.book;
        const book_name = book.Book;
        const book_author = book.Author;
        const book_price = (book.Price / 100).toFixed(2);
        const book_num = book.num;
        const total_price = (book.Price * book_num /100).toFixed(2);
        return(
            <tr>
                <td>{book_name}</td>
                <td>{book_author}</td>
                <td>{book_price}</td>
                <td>
                    <button style={style2} onClick={this.Minus}>-</button>
                    <input id="numwant" type="text" placeholder={book_num} value={this.state.amount} onChange={this.setAmount}/>
                    <button style={style2} onClick={this.Add}>+</button>
                </td>
                <td>{total_price}</td>
            </tr>
        );
    }
}

class CartList extends Component {
    constructor() {
        super();
        this.state = {data: CartData};
    }
    render() {
        const rows = [];
        this.state.data.forEach(book => {
            if(book.num !== 0)
                rows.push(<CartRow book={book}/>)
        });
        return (
            <table>
                <thead>
                <tr>
                    <th className="t1">Book</th>
                    <th className="t2">Author</th>
                    <th className="t4">Price</th>
                    <th className="t4">Amount</th>
                    <th className="t4">Total</th>
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