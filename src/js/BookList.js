import React , {Component} from 'react';
import 'file-saver';
import '../css/css.css';
import { Link } from 'react-router-dom';
import {BookData} from '../Data/BookData';

let flag = { Book: true, Author: true, Language: true, Published: true, Price: true, Sales: true };

let style = {
    backgroundColor: '#8dc63f',
    fontSize: 20,
    fontWeight: 500,
    height: 52,
    padding: '0 3vmin',
    borderRadius: 5,
    color: '#fff'
};

class BookRow extends  Component {
    render() {
        const book = this.props.book;
        const book_name = book.Book;
        const book_author = book.Author;
        const book_price = (book.Price / 100).toFixed(2);
        const book_sales = book.Sales;
        const book_id = book.ID;
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
    if ((typeof BookData[0][propertyName]) !== "number") {
        return function(object1, object2) {
            let value1 = object1[propertyName];
            let value2 = object2[propertyName];
            return value1.localeCompare(value2);
        }
    }
    else {
        return function(object1, object2) {
            let value1 = object1[propertyName];
            let value2 = object2[propertyName];
            return value1 - value2;
        }
    }
}

function downSort(propertyName) {
    if ((typeof BookData[0][propertyName]) !== "number") {
        return function(object1, object2) {
            let value1 = object1[propertyName];
            let value2 = object2[propertyName];
            return value2.localeCompare(value1);
        }
    }
    else {
        return function(object1, object2) {
            let value1 = object1[propertyName];
            let value2 = object2[propertyName];
            return value2 - value1;
        }
    }
}

class BookTable extends Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            data: this.props.data
        }
    }
    handleClick(e) {
        let prop = e.target.innerHTML;
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
                    <option value="Book">Book</option>
                    <option value="Author">Author</option>
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
        this.state = {filterText: '', filterHeader: 'Book'};
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
                <BookTable data={this.props.data} filterText={this.state.filterText} filterHeader={this.state.filterHeader} />
                <div className="export">
                    <Export />
                </div>
            </div>
        );
    }
}

class BookList extends Component {
    render() {
        return (

            <FilterableBookTable data={BookData} />
        );
    }
}

export default BookList;
