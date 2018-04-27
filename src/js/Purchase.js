import React , {Component} from 'react';
import { Redirect } from 'react-router-dom';
import '../css/css.css';

import {BookData, Sell} from "../Data/BookData";
import {style} from "./style";

class BookInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {data:BookData};
    }
    BookChoose = {ID:this.props.bookID, bookName:'', Author:'', Language:'', Published:'', Price:''};
    render() {
        this.state.data.forEach((book) => {
            if(book.ID === this.BookChoose.ID) {
                this.BookChoose.bookName = book.Book;
                this.BookChoose.Author = book.Author;
                this.BookChoose.Language = book.Language;
                this.BookChoose.Published = book.Published;
                this.BookChoose.Price = (book.Price / 100).toFixed(2);
            }
        });
        return (
            <div className="Inf">
                <h4>
                    <p className="Header">Book: </p>
                    <p className="Content">{this.BookChoose.bookName}</p>
                </h4>
                <h4>
                    <p className="Header">Author: </p>
                    <p className="Content">{this.BookChoose.Author}</p>
                </h4>
                <h4>
                    <p className="Header">Language: </p>
                    <p className="Content">{this.BookChoose.Language}</p>
                </h4>
                <h4>
                    <p className="Header">Published: </p>
                    <p className="Content">{this.BookChoose.Published}</p>
                </h4>
                <h4>
                    <p className="Header">Price: </p>
                    <p className="Content">{this.BookChoose.Price}</p>
                </h4>
            </div>
        );
    }
}

class Purchase extends Component {
    constructor(){
        super();
        this.state={redirect:false};
    }
    handleConfirmClick = () => {
        this.setState({redirect:true});
        Sell(this.props.location.state.bookid, 1);
        alert("Success\n\nReturn to BookList Soon.");
    };
    handleCancelClick = () => {
        this.setState({redirect:true});
    };
    render() {
        if(this.state.redirect) {
            return (
                <Redirect push to="/booklist" />
            );
        }
        return (
            <div>
                <BookInfo bookID={this.props.location.state.bookid}/>
                <div className="Button">
                    <button style={style} onClick={this.handleConfirmClick}>Confirm</button>
                    <button style={style} onClick={this.handleCancelClick}>Cancel</button>
                </div>
            </div>
        );
    }
}

export default Purchase;