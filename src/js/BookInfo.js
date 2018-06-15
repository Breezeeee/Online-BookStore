import React , {Component} from 'react';
import { Redirect } from 'react-router-dom';
import '../css/css.css';
import $ from 'jquery';
import {Button, Navbar, FormGroup, ControlLabel, FormControl, Col, Row, ListGroupItem, ListGroup} from 'react-bootstrap';

import {isLogin, setAdmin, setLogin} from "../index";

class Information extends Component {
    constructor(props) {
        super(props);
        this.setAmount = this.setAmount.bind(this);
        this.Add = this.Add.bind(this);
        this.Minus = this.Minus.bind(this);
        this.AddToCart = this.AddToCart.bind(this);
        this.state = {amount: 1, redirect: false};
    }
    Add() {
        let num = document.getElementById("num");
        let want_amount = parseInt(num.value) + 1;
        let book_left = this.ChooseBook.Stock;
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
        let book_left = this.ChooseBook.Stock;
        if(want_amount > book_left) {
            want_amount = book_left;
            e.target.value = want_amount;
        }
        if(want_amount === "" || want_amount === "0") {
            want_amount = 1;
            e.target.value = want_amount;
        }
        this.setState({amount: want_amount});
    };
    AddToCart() {
        if(!isLogin) {
            alert("Please login first!");
            this.setState({redirect: true});
        }
        else {
            let num = document.getElementById("num");
            let want_amount = parseInt(num.value);
            $.ajax({
                url:"/saveitem2",
                data:{
                    bid: this.ChooseBook.ID,
                    num: want_amount
                },
                context:document.body,
                async:true,
                type:"get",
            });
            alert("Success!");
        }
    }
    ChooseBook = {ID: this.props.BookID, Book: '', Author: '', Language: '', Published: '', Price: 0, Stock: 0};
    render() {
        let book = null;
        $.ajax({
            url:"/qbook",
            data:{
                id:this.props.BookID
            },
            context:document.body,
            async:false,
            type:"get",
            success:function(data) {
                book = $.parseJSON(data);
            }
        });
        this.ChooseBook.Book = book.name;
        this.ChooseBook.Author = book.author;
        this.ChooseBook.Language = book.language;
        this.ChooseBook.Published = book.published;
        this.ChooseBook.Price = (Number(book.price) / 100).toFixed(2);
        this.ChooseBook.Stock = Number(book.stock);

        if (this.state.redirect) {
            return (
                <Redirect push to="/login"/>
            );
        }

        return (
            <Col md={3} mdOffset={5}>
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
                    <p className="Header">Stock: </p>
                    <p className="Content">{this.ChooseBook.Stock}</p>
                </h4>
                <Navbar.Form>
                    <FormGroup>
                        <ControlLabel>Amount</ControlLabel>
                        {' '}
                        <Button bsStyle="success" bsSize="small" onClick={this.Minus}>-</Button>
                        <FormControl id="num" type="text" placeholder="1" value={this.state.amount} onChange={this.setAmount}/>
                        <Button bsStyle="success" bsSize="small" onClick={this.Add}>+</Button>
                        {'  '}
                        <Button bsStyle="success" onClick={this.AddToCart}>Add to Cart</Button>
                    </FormGroup>
                </Navbar.Form>
            </Col>
        );
    }
}

class Comments extends Component {
    render() {
        let comments = "null";
        $.ajax({
            url: "/qcomments",
            data:{
                id:this.props.BookID
            },
            context:document.body,
            async:false,
            type:"get",
            success:function(data) {
                if(data === "null")
                    comments = "null";
                else
                    comments = $.parseJSON(data)["comments"];
            }
        });
        if(comments === "null")
            return(
                <ListGroup>
                    <ListGroupItem>No comments</ListGroupItem>
                </ListGroup>);
        let rows = [];
        for(let i = 0; i < comments.length; i++) {
            rows.push(<ListGroupItem>{comments[i]}</ListGroupItem>);
        }
        return(
            <div>
                <h4>Comments</h4>
                <ListGroup>{rows}</ListGroup>
            </div>
        );
    }
}

class AddComment extends Component {
    constructor() {
        super();
        this.handleConfirmClick = this.handleConfirmClick.bind(this);
        this.state = {comment:""};
    }

    handleChange = (e) => {
        this.setState({comment:e.target.value});
    };

    handleConfirmClick() {
        let comment = this.state.comment;
        if(comment === "")
            alert("comment can't be empty");
        else {
            $.ajax({
                url: "/savecomment",
                data:{
                    bid:this.props.BookID,
                    comment:comment
                },
                context:document.body,
                async:true,
                type:"get"
            });
            alert("success");
            window.location.reload();
        }
    }

    render() {
        return(
            <form>
                <FormGroup>
                    <FormControl componentClass="textarea" type="text" value={this.state.comment} placeholder="Your Comment." onChange={this.handleChange}/>
                </FormGroup>
                <Button bsStyle="success" onClick={this.handleConfirmClick}>Confirm</Button>
            </form>
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
        return (
            <div>
                <Row>
                    <Information BookID={this.props.location.state.bookid}/>
                </Row>
                <Row>
                    <Col md={6} mdOffset={3}>
                        <Comments BookID={this.props.location.state.bookid}/>
                    </Col>
                </Row>
                <Row>
                    <Col md={6} mdOffset={3}>
                        <AddComment BookID={this.props.location.state.bookid}/>
                    </Col>
                </Row>
                <Row>
                    <Col md={1} mdOffset={10}>
                        <Button bsStyle="primary" onClick={this.handleCancelClick}>Back</Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default BookInfo;