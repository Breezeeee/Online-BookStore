import React , {Component} from 'react';
import { Redirect } from 'react-router-dom';
import '../css/css.css';
import $ from 'jquery';
import {Button, Table, Col, FormControl, Navbar} from 'react-bootstrap';

import {setAdmin, setLogin} from "../index";

class CartRow extends  Component {
    constructor(props) {
        super(props);
        this.delBook = this.delBook.bind(this);
        this.setAmount = this.setAmount.bind(this);
        this.state = {amount: this.props.book.num};
    }
    Book = {name:"", author:"", bid:"", price:0, stock:0, num:0};
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
    };

    render() {
        const book = this.props.book;
        this.Book.name = book.bname;
        this.Book.author = book.author;
        this.Book.bid = book.bid;
        this.Book.price = (Number(book.price) / 100).toFixed(2);
        this.Book.num = Number(book.num);
        this.Book.stock= Number(book.stock);
        return(
            <tr>
                <td>{this.Book.name}</td>
                <td>{this.Book.author}</td>
                <td>{this.Book.price}</td>
                <td>
                    <Navbar.Form><FormControl id={this.Book.bid} type="number" placeholder={this.Book.num} value={this.state.amount} onChange={this.setAmount}/></Navbar.Form>
                </td>
                <td className="t4">
                    <Button bsStyle="primary" onClick={this.delBook}>delete</Button>
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
            <Col md={10} mdOffset={1}>
            <Table striped bordered condensed hover>
                <thead>
                <tr>
                    <th className="t1">Book</th>
                    <th className="t1">Author</th>
                    <th className="t4">Price</th>
                    <th className="t4">Amount</th>
                    <th> </th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
            </Col>
        );
    }
}

class Cart extends Component {
    constructor() {
        super();
        this.state = {redirect: false, redirect2: false, redirect3: false};
    }

    handleCreateOrderClick = () => {
        let success = true;
        $.ajax({
            url:"/checkcart",
            context:document.body,
            async:false,
            type:"get",
            success:function(data) {
                if(data === "false") {
                    success = false;
                }
            }
        });
        if(!success)
            alert("Cart can't be empty");
        else
            this.setState({redirect2: true});
    };

    handleCancelClick = () => {
        this.setState({redirect: true});
    };

    render() {
        let islogin = false;
        let isAdmin = false;
        $.ajax({
            url:"/checkstate",
            context:document.body,
            async:false,
            type:"get",
            success: function(data) {
                if(data !== "null") {
                    islogin = true;
                }
                if(data === "admin") {
                    isAdmin = true;
                }
            }
        });
        if(islogin) {
            setLogin(true);
        }
        else {
            setLogin(false);
            alert("Please login first");
            this.setState({redirect3:true});
        }
        if(isAdmin) {
            setAdmin(true);
        }
        else {
            setAdmin(false);
        }
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
        if (this.state.redirect3) {
            return(
                <Redirect push to="/login"/>
            );
        }
        return (
            <div>
                <CartList/>
                <div className="Button">
                    <Button bsStyle="primary" onClick={this.handleCreateOrderClick}>Create Order</Button>
                    {" "}
                    <Button bsStyle="primary" onClick={this.handleCancelClick}>Back to BookList</Button>
                </div>
            </div>
        );
    }
}

export default Cart;