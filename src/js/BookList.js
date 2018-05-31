import React , {Component} from 'react';
import 'file-saver';
import '../css/css.css';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import {setAdmin, setLogin} from "../index";
import {Button, Table, Col} from 'react-bootstrap';

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
                <td className="t3">
                    <Button><Link to={{pathname:"/bookinfo", state:{bookid: book_id}}}>Information</Link></Button>
                </td>
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
        this.state = {data: BookData}
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
            if (book[filterHeader].toLowerCase().indexOf(filterText.toLowerCase()) === -1)
                return;
            let price1 = 0;
            let price2 = 0;
            if(this.props.price1 === "")
                price1 = 0;
            else
                price1 = Number(this.props.price1) * 100;
            if(this.props.price2 === "")
                price2 = 1000000;
            else
                price2 = Number(this.props.price2) * 100;
            if (Number(book.price) < price1 || Number(book.price) > price2)
                return;
            rows.push(<BookRow book={book}/>)
        });
        return(
            <Col md={10} mdOffset={1}>
            <Table striped bordered condensed hover>
                <thead>
                <tr>
                    <th onClick={this.handleClick} className="t1">Book</th>
                    <th onClick={this.handleClick} className="t2">Author</th>
                    <th onClick={this.handleClick} className="t4">Price</th>
                    <th onClick={this.handleClick} className="t4">Sales</th>
                    <th>Info</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
            </Col>
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

class SearchPrice extends Component {
    constructor(props) {
        super(props);
        this.handlePrice1Change = this.handlePrice1Change.bind(this);
        this.handlePrice2Change = this.handlePrice2Change.bind(this);
    }
    OldPrice = {price1:"", price2:""};
    handlePrice1Change(e) {
        let flag = true;
        let new_price1 = e.target.value;
        for(let i = 0; i < new_price1.length; i++) {
            if(new_price1.charAt(i) < '0' || new_price1.charAt(i) > '9')
                flag = false;
        }
        if(!flag)
            new_price1 = this.OldPrice.price1;
        this.OldPrice.price1 = new_price1;
        e.target.value = new_price1;
        this.props.onPrice1Change(new_price1);
    }
    handlePrice2Change(e) {
        let flag = true;
        let new_price2 = e.target.value;
        for(let i = 0; i < new_price2.length; i++) {
            if(new_price2.charAt(i) < '0' || new_price2.charAt(i) > '9')
                flag = false;
        }
        if(!flag)
            new_price2 = this.OldPrice.price2;
        this.OldPrice.price2 = new_price2;
        e.target.value = new_price2;
        this.props.onPrice2Change(new_price2);
    }
    render() {
        return (
            <div className="SearchBarInput2">
                Price
                <input type="text" placeholder="Lowest" value={this.props.price1} onChange={this.handlePrice1Change} />
                -
                <input type="text" placeholder="Highest" value={this.props.price2} onChange={this.handlePrice2Change} />
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
                <Button bsStyle="primary" onClick={()=>this.ExportJSON()}>Export JSON</Button>
                <Button bsStyle="primary" onClick={()=>this.ExportCSV()}>Export CSV</Button>
            </div>
        );
    }
}

class FilterableBookTable extends Component {
    constructor(props){
        super(props);
        this.state = {filterText: '', filterHeader: 'name', price1:"", price2:""};
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
        this.handleFilterHeaderChange = this.handleFilterHeaderChange.bind(this);
        this.handlePrice1Change = this.handlePrice1Change.bind(this);
        this.handlePrice2Change = this.handlePrice2Change.bind(this);
    }
    handleFilterTextChange(filterText) {
        this.setState({ filterText: filterText });
    }
    handleFilterHeaderChange(filterHeader) {
        this.setState({ filterHeader: filterHeader });
    }
    handlePrice1Change(price1) {
        this.setState({price1: price1});
    }
    handlePrice2Change(price2) {
        this.setState({price2: price2});
    }
    render() {
        return (
            <div>
                <SearchPrice price1={this.state.price1} price2={this.state.price2} onPrice1Change={this.handlePrice1Change} onPrice2Change={this.handlePrice2Change}/>
                <SearchBar filterText={this.state.filterText} onFilterTextChange={this.handleFilterTextChange} onFilterHeaderChange={this.handleFilterHeaderChange} />
                <BookTable filterText={this.state.filterText} filterHeader={this.state.filterHeader} price1={this.state.price1} price2={this.state.price2}/>
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
