import React , {Component} from 'react';
import 'file-saver';
import './App.css';

let data = [
    {Book: "The Lord of the Rings", Author: "J. R. R. Tolkien", Language: "English", Published: "1954-1955", Price: 9999, Sales: 15000},
    {Book: "Le Petit Prince (The Little Prince)", Author: "Antoine de Saint-Exupéry", Language: "French", Published: "1943", Price: 13000, Sales: 14000},
    {Book: "Harry Potter and the Philosopher's Stone", Author: "J. K. Rowling", Language: "English", Published: "1997", Price: 6000, Sales: 10700},
    {Book: "And Then There Were None", Author: "Agatha Christie", Language: "English", Published: "1939", Price: 5000, Sales: 10000},
    {Book: "Dream of the Red Chamber", Author: "Cao Xueqin", Language: "Chinese", Published: "1754-1791", Price: 12000, Sales: 10000},
    {Book: "The Hobbit", Author: "J. R. R. Tolkien", Language: "English", Published: "1937", Price: 3000, Sales: 10000},
    {Book: "She: A History of Adventure", Author: "H. Rider Haggard", Language: "English", Published: "1887", Price: 9999, Sales: 5000},
];

let flag = { Book: true, Author: true, Language: true, Published: true, Price: true, Sales: true };

class BookRow extends  Component {
    render() {
        const book = this.props.book;
        const book_name = book.Book;
        const book_author = book.Author;
        const book_language = book.Language;
        const book_published = book.Published;
        const book_price = (book.Price / 100).toFixed(2);
        const book_sales = book.Sales;
        return(
            <tr>
                <td>{book_name}</td>
                <td>{book_author}</td>
                <td>{book_language}</td>
                <td>{book_published}</td>
                <td>{book_price}</td>
                <td>{book_sales}</td>
            </tr>
        );
    }
}

function upSort(propertyName) {
    if ((typeof data[0][propertyName]) !== "number") {
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
    if ((typeof data[0][propertyName]) !== "number") {
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
        if (filterHeader === "Published" && filterText.indexOf("-") === -1) {
                this.state.data.forEach((book) => {
                        if(filterText.length > 4) {
                            return;
                        }
                        let Published_year = book[filterHeader];
                        if (Published_year.length === 4) {
                            if (book[filterHeader].indexOf(filterText) === -1) {
                                return;
                            }
                            rows.push(<BookRow book={book}/>)
                        }
                        else {
                            let Book_Published = Published_year.split("-");
                            if (book[filterHeader].indexOf(filterText) === -1) {
                                if (Book_Published[0] > filterText || Book_Published[1] < filterText) {
                                    return;
                                }
                            }
                            rows.push(<BookRow book={book}/>)
                        }
                    }
                );
        }
        else {
            this.state.data.forEach((book) => {
                    if (book[filterHeader].toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
                        return;
                    }
                    rows.push(<BookRow book={book}/>)
                }
            );
        }
        return(
            <table>
                <thead>
                <tr>
                    <th onClick={this.handleClick} className="t1">Book</th>
                    <th onClick={this.handleClick} className="t2">Author</th>
                    <th onClick={this.handleClick} className="t4">Language</th>
                    <th onClick={this.handleClick} className="t3">Published</th>
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
                    <option value="Language">Language</option>
                    <option value="Published">Published</option>
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
            let FileSaver = require("../node_modules/file-saver/FileSaver.min");
            let blob = new Blob([JSON.stringify(data)], {type: "text/plain; charset=utf-8"});
            FileSaver.saveAs(blob, "Books.json");
        }
    }

    ExportCSV() {
        const confirmed = window.confirm('Sure to download?');
        if(confirmed) {
            let FileSaver = require("../node_modules/file-saver/FileSaver.min");
            const Json2csvParser = require("../node_modules/json2csv").Parser;
            const header = ['Book', 'Author', 'Language', 'Published', 'Price', 'Sales'];
            const json2csvParser = new Json2csvParser({header});
            const csv = json2csvParser.parse(data);
            console.log(csv);
            let blob = new Blob([csv], {type: "text/plain; charset=utf-8"});
            FileSaver.saveAs(blob, "Books.csv");
        }
    }

    style = {
        backgroundColor: '#8dc63f',
        fontSize: 20,
        fontWeight: 500,
        height: 52,
        padding: '0 3vmin',
        borderRadius: 5,
        color: '#fff'
    };

    render() {
        return(
            <div>
                <button style={this.style} onClick={()=>this.ExportJSON()}>Export JSON</button>
                <button style={this.style} onClick={()=>this.ExportCSV()}>Export CSV</button>
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
                <h1 className="title">Online Bookstore</h1>
                <SearchBar filterText={this.state.filterText} onFilterTextChange={this.handleFilterTextChange} onFilterHeaderChange={this.handleFilterHeaderChange} />
                <BookTable data={this.props.data} filterText={this.state.filterText} filterHeader={this.state.filterHeader} />
                <div className="export">
                    <Export />
                </div>
            </div>
        );
    }
}

class App extends Component {
    render() {
        return (
            <FilterableBookTable data={data} />
        );
    }
}

export default App;
