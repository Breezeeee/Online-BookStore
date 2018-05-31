import React , {Component} from 'react';
import { Redirect } from 'react-router-dom';
import '../css/css.css';
import $ from 'jquery';
import {Button, Table, Col} from 'react-bootstrap';
import {setAdmin, setLogin} from "../index";

class ItemRow extends Component {
    Book = {name:"", price:0, num:0, subtotal:0};
    render() {
        const book = this.props.book;
        this.Book.name = book.bname;
        this.Book.price = (Number(book.price) / 100).toFixed(2);
        this.Book.num = Number(book.num);
        this.Book.subtotal = (Number(book.price) * Number(book.num) /100).toFixed(2);
        return(
            <tr>
                <td>{this.Book.name}</td>
                <td>{this.Book.price}</td>
                <td>{this.Book.num}</td>
                <td>{this.Book.subtotal}</td>
            </tr>
        );
    }
}

class ItemList extends Component {
    render() {
        const rows = [];
        let total = 0;
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
            rows.push(<ItemRow book={book}/>);
            total += Number(book.num) * Number(book.price);
        });
        total = (total / 100).toFixed(2);
        return (
            <div>
                <Col md={10} mdOffset={1}>
                    <Table striped bordered condensed hover>
                        <thead>
                        <tr>
                            <th className="t1">Book</th>
                            <th className="t4">Price</th>
                            <th className="t4">Amount</th>
                            <th className="t4">SubTotal</th>
                        </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </Table>
                </Col>
                <h2 className={"CreateOrder"}>Total: {total}</h2>
            </div>
        );
    }
}

class CreateOrder extends Component {
    constructor() {
        super();
        this.setAddress = this.setAddress.bind(this);
        this.state = ({address:"", redirect:false, redirect2:false, oid:"", redirect3: false});
    }

    setAddress(e) {
        this.setState({address:e.target.value});
    }
    handleCancelClick = () => {
        this.setState({redirect:true});
    };
    handleConfirmClick = () => {
        if(this.state.address === "") {
            alert("Address can't be empty");
        }
        else {
            let orderid = "";
            $.ajax({
                url:"/saveorder",
                data:{
                    address:this.state.address
                },
                context:document.body,
                async:false,
                type:"get",
                success:function(data) {
                    orderid = data;
                }
            });
            this.setState({redirect2: true, oid: orderid});
            alert("Success!");
        }
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
        if(this.state.redirect) {
            return(
                <Redirect push to="/cart"/>
            );
        }
        if(this.state.redirect2) {
            return(
                <Redirect to={{pathname:"/orderinfo", state:{oid:this.state.oid}}}/>
            );
        }
        if (this.state.redirect3) {
            return(
                <Redirect push to="/login"/>
            );
        }
        return(
            <div>
                <ItemList/>
                <h3 className="CreateOrder">
                    Address:
                    <input type="text" value={this.state.address} onChange={this.setAddress}/>
                </h3>
                <div className="Button">
                    <Button bsStyle="primary" onClick={this.handleConfirmClick}>Confirm</Button>
                    <Button bsStyle="primary" onClick={this.handleCancelClick}>Cancel</Button>
                </div>
            </div>
        );
    }
}
export default CreateOrder;