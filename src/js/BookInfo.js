import React , {Component} from 'react';
import { Redirect } from 'react-router-dom';
import '../css/css.css';

import {BookData} from "../Data/BookData";
import {Want} from "../Data/CartData";

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

class Information extends Component {
    constructor(props) {
        super(props);
        this.setAmount = this.setAmount.bind(this);
        this.Add = this.Add.bind(this);
        this.Minus = this.Minus.bind(this);
        this.AddToCart = this.AddToCart.bind(this);
        this.state = {data: BookData, amount: 1};
    }
    Add() {
        let num = document.getElementById("num");
        let want_amount = parseInt(num.value) + 1;
        let book_left = this.ChooseBook.Left;
        if(want_amount > book_left)
            want_amount = book_left;
        this.setState({amount: want_amount});
        num.value = want_amount;
    }
    Minus() {
        let num = document.getElementById("num");
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
        let book_left = this.ChooseBook.Left;
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
    AddToCart() {
        let num = document.getElementById("num");
        let want_amount = parseInt(num.value);
        Want(this.ChooseBook.ID, want_amount);
        alert("Success!");
    }
    ChooseBook = {ID: this.props.BookID, Book: '', Author: '', Language: '', Published: '', Price: '', Left: ''};
    render() {
        this.state.data.forEach((book) => {
            if (book.ID === this.ChooseBook.ID) {
                this.ChooseBook.Book = book.Book;
                this.ChooseBook.Author = book.Author;
                this.ChooseBook.Language = book.Language;
                this.ChooseBook.Published = book.Published;
                this.ChooseBook.Price = (book.Price / 100).toFixed(2);
                this.ChooseBook.Left = book.Left;
            }
        });
        return (
            <div className="Inf">
                <h4>
                    <p className="Header">Name: </p>
                    <p className="Content">{this.ChooseBook.Book}</p>
                </h4>
                <h4>
                    <p className="Header">Author: </p>
                    <p className="Content">{this.ChooseBook.Author}</p>
                </h4>
                <h4>
                    <p className="Header">Language: </p>
                    <p className="Content">{this.ChooseBook.Language}</p>
                </h4>
                <h4>
                    <p className="Header">Published: </p>
                    <p className="Content">{this.ChooseBook.Published}</p>
                </h4>
                <h4>
                    <p className="Header">Price: </p>
                    <p className="Content">{this.ChooseBook.Price}</p>
                </h4>
                <h4>
                    <p className="Header">Left: </p>
                    <p className="Content">{this.ChooseBook.Left}</p>
                </h4>
                <p className="Header">
                    Amount:
                    <button style={style2} onClick={this.Minus}>-</button>
                    <input id="num" type="text" placeholder="1" value={this.state.amount} onChange={this.setAmount}/>
                    <button style={style2} onClick={this.Add}>+</button>
                    <button style={style2} onClick={this.AddToCart}>Add to Cart</button>
                </p>
            </div>
        );
    }
}

class BookInfo extends Component {
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
                <Information BookID={this.props.location.state.bookid}/>
                <div className="Button">
                    <button style={style} onClick={this.handleCancelClick}>Back</button>
                </div>
            </div>
        );
    }
}

export default BookInfo;