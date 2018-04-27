import React , {Component} from 'react';
import { Redirect } from 'react-router-dom';
import '../css/css.css';
import $ from 'jquery';
import {style} from "./style";

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
                <div>
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
                </div>
                <h2>Total: {total}</h2>
            </div>
        );
    }
}

class CreateOrder extends Component {
    constructor() {
        super();
        this.setAddress = this.setAddress.bind(this);
        this.state = ({address:"", redirect:false, redirect2:false});
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
            $.ajax({
                url:"/saveorder",
                data:{
                    address:this.state.address
                },
                context:document.body,
                async:false,
                type:"get"
            });
            this.setState({redirect2: true});
            alert("Success!");
        }
    };
    render() {
        if(this.state.redirect) {
            return(
                <Redirect push to="/cart"/>
            );
        }
        if(this.state.redirect2) {
            return(
                <Redirect push to="/booklist"/>
            );
        }
        return(
            <div>
                <ItemList/>
                <div>
                    Address:
                    <input type="text" value={this.state.address} onChange={this.setAddress}/>
                </div>
                <div>
                    <button style={style} onClick={this.handleConfirmClick}>Confirm</button>
                    <button style={style} onClick={this.handleCancelClick}>Cancel</button>
                </div>
            </div>
        );
    }
}
export default CreateOrder;