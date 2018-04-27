import React , {Component} from 'react';
import 'file-saver';
import '../css/css.css';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import {setLogin} from "../index";
import {style} from "./style";

let BookData = null;
let flag = { name: true, author: true, price: true, sales: true };

class BookRow extends  Component {
    render() {
        const book = this.props.book;
        const book_name = book.name;
        const book_author = book.author;
        const book_price = (Number(book.price) / 100).toFixed(2);
        const book_sales = Number(book.sales);
        const book_id = book.id;
        return(
            <tr>
                <td>{book_name}</td>
                <td>{book_author}</td>
                <td>{book_price}</td>
                <td>{book_sales}</td>
                <td className="t3"><Link to={{pathname:"/bookinfo", state:{bookid: book_id}}} style={style}>Information</Link></td>
            </tr>
        );
    }
}

function upSort(propertyName) {
    if (propertyName !== "price" && propertyName !== "sales") {
        return function(object1, object2) {
            let value1 = object1[propertyName];
            let value2 = object2[propertyName];
            return value1.localeCompare(value2);
        }
    }
    else {
        return function(object1, object2) {
            let value1 = Number(object1[propertyName]);
            let value2 = Number(object2[propertyName]);
            return value1 - value2;
        }
    }
}

function downSort(propertyName) {
    if (propertyName !== "price" && propertyName !== "sales") {
        return function(object1, object2) {
            let value1 = object1[propertyName];
            let value2 = object2[propertyName];
            return value2.localeCompare(value1);
        }
    }
    else {
        return function(object1, object2) {
            let value1 = Number(object1[propertyName]);
            let value2 = Number(object2[propertyName]);
            return value2 - value1;
        }
    }
}

class BookTable extends Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            data: BookData
        }
    }
    handleClick(e) {
        let prop = e.target.innerHTML;
        prop = prop.toLowerCase();
        if(prop === "book")
            prop = "name";
        if (flag[prop] === true)
            this.state.data.sort(upSort(prop));
        else
            this.state.data.sort(downSort(prop));
        flag[prop] = !flag[prop];
        this.setState({data:this.state.data});
    }

    render() {
        const filterText = this.props.filterText;
        const filterHeader = this.props.filterHeader;
        const rows = [];
        this.state.data.forEach((book) => {
            if (book[filterHeader].toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
                return;
                }
                rows.push(<BookRow book={book}/>)
            });
        return(
            <table>
                <thead>
                <tr>
                    <th onClick={this.handleClick} className="t1">Book</th>
                    <th onClick={this.handleClick} className="t2">Author</th>
                    <th onClick={this.handleClick} className="t4">Price</th>
                    <th onClick={this.handleClick} className="t4">Sales</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        )
    }
}

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
        this.handleFilterHeaderChange = this.handleFilterHeaderChange.bind(this);
    }
    handleFilterTextChange(e) {
        this.props.onFilterTextChange(e.target.value);
    }
    handleFilterHeaderChange(e) {
        this.props.onFilterHeaderChange(e.target.value);
    }
    render() {
        return (
            <div className="SearchBarInput">
                Search
                <select onChange={this.handleFilterHeaderChange}>
                    <option value="name">Book</option>
                    <option value="author">Author</option>
                </select>
                <input type="text" placeholder="Keyword" value={this.props.filterText} onChange={this.handleFilterTextChange} />
            </div>
        );
    }
}

class Export extends Component{

    ExportJSON() {
        const confirmed = window.confirm('Sure to download?');
        if(confirmed) {
            let FileSaver = require("../../node_modules/file-saver/FileSaver.min");
            let blob = new Blob([JSON.stringify(BookData)], {type: "text/plain; charset=utf-8"});
            FileSaver.saveAs(blob, "Books.json");
        }
    }

    ExportCSV() {
        const confirmed = window.confirm('Sure to download?');
        if(confirmed) {
            let FileSaver = require("../../node_modules/file-saver/FileSaver.min");
            const Json2csvParser = require("../../node_modules/json2csv").Parser;
            const header = ['Book', 'Author', 'Language', 'Published', 'Price', 'Sales', 'Left'];
            const json2csvParser = new Json2csvParser({header});
            const csv = json2csvParser.parse(BookData);
            console.log(csv);
            let blob = new Blob([csv], {type: "text/plain; charset=utf-8"});
            FileSaver.saveAs(blob, "Books.csv");
        }
    }

    render() {
        return(
            <div>
                <button style={style} onClick={()=>this.ExportJSON()}>Export JSON</button>
                <button style={style} onClick={()=>this.ExportCSV()}>Export CSV</button>
            </div>
        );
    }
}

class FilterableBookTable extends Component {
    constructor(props){
        super(props);
        this.state = {filterText: '', filterHeader: 'name'};
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
        this.handleFilterHeaderChange = this.handleFilterHeaderChange.bind(this);
    }
    handleFilterTextChange(filterText) {
        this.setState({ filterText: filterText });
    }
    handleFilterHeaderChange(filterHeader) {
        this.setState({ filterHeader: filterHeader });
    }
    render() {
        return (
            <div>
                <SearchBar filterText={this.state.filterText} onFilterTextChange={this.handleFilterTextChange} onFilterHeaderChange={this.handleFilterHeaderChange} />
                <BookTable filterText={this.state.filterText} filterHeader={this.state.filterHeader} />
                <div className="export">
                    <Export />
                </div>
            </div>
        );
    }
}

class BookList extends Component {
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
        $.ajax({
            url:"/allbook",
            context:document.body,
            async:false,
            type:"get",
            success:function(data){
                BookData = $.parseJSON(data);
            }
        });
        return (
            <FilterableBookTable/>
        );
    }
}

export default BookList;
