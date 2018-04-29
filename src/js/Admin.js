import React , {Component} from 'react';
import { Redirect, Link} from 'react-router-dom';
import '../css/css.css';
import $ from 'jquery';
import {setAdmin, setLogin} from "../index";
import {style} from "./style";

class AddUser extends Component {
    constructor() {
        super();
        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setPhonenumber = this.setPhonenumber.bind(this);
        this.state = {username:"", password:"", email:"", phonenumber:""};
    }
    setUsername(e) {
        this.setState({username : e.target.value});
    }
    setPassword(e) {
        this.setState({password : e.target.value});
    }
    setEmail(e) {
        this.setState({email : e.target.value});
    }
    setPhonenumber(e) {
        this.setState({phonenumber : e.target.value});
    }
    handleConfirmClick = () => {
        let new_username = this.state.username;
        let new_password = this.state.password;
        let new_email = this.state.email;
        let new_phonenumber = this.state.phonenumber;
        let err = "";
        $.ajax({
            url:"/checkusername",
            data:{
                username:new_username
            },
            context:document.body,
            async:false,
            type:"get",
            success: function(data) {
                if(data === "false") {
                    err += "username already exists\n";
                }
            }
        });
        let p_valid = 0;
        for(let i = 0; i < new_password.length; i++) {
            if(new_password.charAt(i) > '0' && new_password.charAt(i) < '9') {
                if(p_valid === 0)
                    p_valid = 1;
                if(p_valid === 2) {
                    p_valid = 3;
                    break;
                }
            }
            if((new_password.charAt(i) > 'a' && new_password.charAt(i) < 'z') || (new_password.charAt(i) > 'A' && new_password.charAt(i) < 'Z')) {
                if(p_valid === 0)
                    p_valid = 2;
                if(p_valid === 1) {
                    p_valid = 3;
                    break;
                }
            }
        }
        if(p_valid !== 3) {
            err += "password must contain both letters and numbers\n";
        }
        let re2 = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if(!re2.test(new_email)) {
            err += "invalid email format\n";
        }
        let re3=/^(1+\d{10})$/;
        if(!re3.test(new_phonenumber)) {
            err += "invalid phonenumber";
        }
        if(err !== "") {
            alert(err);
        }
        else {
            $.ajax({
                url:"/saveuser",
                data:{
                    username:new_username,
                    password:new_password,
                    email:new_email,
                    phonenumber:new_phonenumber
                },
                context:document.body,
                async:false,
                type:"get"
            });
            alert("success");
        }
    };

    render() {
        return (
            <div className="Inf">
                <h4>
                    <p className="Header">Username(Can't change later): </p>
                    <input className="ContentInput" type="text" value={this.state.username} onChange={this.setUsername}/>
                </h4>
                <h4>
                    <p className="Header">PassWord: </p>
                    <input className="ContentInput" type="password" value={this.state.password} onChange={this.setPassword}/>
                </h4>
                <h4>
                    <p className="Header">Email: </p>
                    <input className="ContentInput" type="text" value={this.state.email} onChange={this.setEmail}/>
                </h4>
                <h4>
                    <p className="Header">PhoneNumber: </p>
                    <input className="ContentInput" type="text" value={this.state.phonenumber} onChange={this.setPhonenumber}/>
                </h4>
                <div className="Button3">
                    <button style={style} onClick={this.handleConfirmClick}>Add</button>
                </div>
            </div>
        );
    }
}

class DeleteUser extends Component {
    constructor() {
        super();
        this.setUsername = this.setUsername.bind(this);
        this.state = {username:""};
    }
    setUsername(e) {
        this.setState({username : e.target.value});
    }
    handleConfirmClick = () => {
        const confirmed = window.confirm("Sure to delete all information about the user?");
        if(confirmed) {
            let success = false;
            $.ajax({
                url: "/duser",
                data: {
                    username: this.state.username,
                },
                context: document.body,
                async: false,
                type: "get",
                success: function (data) {
                    if (data !== "null")
                        success = true;
                }
            });
            if (success)
                alert("success");
            else
                alert("no such user");
        }
    };
    render() {
        return (
            <div className="Inf">
                <h4>
                    <p className="Header">Username: </p>
                    <input className="ContentInput" type="text" value={this.state.username} onChange={this.setUsername}/>
                </h4>
                <div className="Button3">
                    <button style={style} onClick={this.handleConfirmClick}>Delete</button>
                </div>
            </div>
        );
    }
}

class BanUser extends Component {
    constructor() {
        super();
        this.setUsername = this.setUsername.bind(this);
        this.state = {username:""};
    }
    setUsername(e) {
        this.setState({username : e.target.value});
    }
    handleBanClick = () => {
        let success = false;
        $.ajax({
            url:"/ban_release",
            data:{
                username: this.state.username,
                state: 0
            },
            context:document.body,
            async:false,
            type:"get",
            success: function (data) {
                if(data !== "null")
                    success = true;
            }
        });
        if(success)
            alert("success");
        else
            alert("no such user");
    };
    handleReleaseClick = () => {
        let success = false;
        $.ajax({
            url:"/ban_release",
            data:{
                username: this.state.username,
                state: 1
            },
            context:document.body,
            async:false,
            type:"get",
            success: function (data) {
                if(data !== "null")
                    success = true;
            }
        });
        if(success)
            alert("success");
        else
            alert("no such user");
    };
    render() {
        return (
            <div className="Inf">
                <h4>
                    <p className="Header">Username: </p>
                    <input className="ContentInput" type="text" value={this.state.username} onChange={this.setUsername}/>
                </h4>
                <div className="Button3">
                    <button style={style} onClick={this.handleBanClick}>Ban</button>
                    <button style={style} onClick={this.handleReleaseClick}>Release</button>
                </div>
            </div>
        );
    }
}

class QueryUser extends Component {
    render() {
        return(
            <h3>Coming Soon</h3>
        );
    }
}

class AddBook extends Component {
    constructor() {
        super();
        this.setName = this.setName.bind(this);
        this.setAuthor = this.setAuthor.bind(this);
        this.setLanguage = this.setLanguage.bind(this);
        this.setPublished = this.setPublished.bind(this);
        this.setPrice = this.setPrice.bind(this);
        this.setStock = this.setStock.bind(this);
        this.state = {name:"", author:"", language:"", published:"", price:0, stock:0};
    }
    setName(e) {
        this.setState({name : e.target.value});
    }
    setAuthor(e) {
        this.setState({author : e.target.value});
    }
    setLanguage(e) {
        this.setState({language : e.target.value});
    }
    setPublished(e) {
        this.setState({published : e.target.value});
    }
    setPrice(e) {
        this.setState({price : Number(e.target.value)});
    }
    setStock(e) {
        this.setState({stock : Number(e.target.value)});
    }
    handleConfirmClick = () => {
        let success = false;
        $.ajax({
            url:"/savebook",
            data:{
                name:this.state.name,
                author:this.state.author,
                language:this.state.language,
                published:this.state.published,
                price:this.state.price * 100,
                stock:this.state.stock
            },
            context:document.body,
            async:false,
            type:"get",
            success:function (data) {
                if(data !== "false")
                    success = true;
            }
        });
        if(success)
            alert("success");
        else
            alert("Book already exists");
    };

    render() {
        return (
            <div className="Inf">
                <h4>
                    <p className="Header">BookName: </p>
                    <input className="ContentInput" type="text" value={this.state.name} onChange={this.setName}/>
                </h4>
                <h4>
                    <p className="Header">Author: </p>
                    <input className="ContentInput" type="text" value={this.state.author} onChange={this.setAuthor}/>
                </h4>
                <h4>
                    <p className="Header">Language: </p>
                    <input className="ContentInput" type="text" value={this.state.language} onChange={this.setLanguage}/>
                </h4>
                <h4>
                    <p className="Header">Published: </p>
                    <input className="ContentInput" type="text" value={this.state.published} onChange={this.setPublished}/>
                </h4>
                <h4>
                    <p className="Header">Price: </p>
                    <input className="ContentInput" type="number" value={this.state.price} onChange={this.setPrice}/>
                </h4>
                <h4>
                    <p className="Header">Stock: </p>
                    <input className="ContentInput" type="number" value={this.state.stock} onChange={this.setStock}/>
                </h4>
                <div className="Button3">
                    <button style={style} onClick={this.handleConfirmClick}>Add</button>
                </div>
            </div>
        );
    }
}

class UpdateBook extends Component {
    constructor() {
        super();
        this.setBid = this.setBid.bind(this);
        this.setName = this.setName.bind(this);
        this.setAuthor = this.setAuthor.bind(this);
        this.setLanguage = this.setLanguage.bind(this);
        this.setPublished = this.setPublished.bind(this);
        this.setPrice = this.setPrice.bind(this);
        this.setStock = this.setStock.bind(this);
        this.state = ({showInfo: false, bid:"", name:"", author:"", language:"", published:"", price:0, stock:0});
    }
    setBid(e) {
        this.setState({bid : e.target.value});
    }
    setName(e) {
        this.setState({name : e.target.value});
    }
    setAuthor(e) {
        this.setState({author : e.target.value});
    }
    setLanguage(e) {
        this.setState({language : e.target.value});
    }
    setPublished(e) {
        this.setState({published : e.target.value});
    }
    setPrice(e) {
        this.setState({price : Number(e.target.value)});
    }
    setStock(e) {
        this.setState({stock : Number(e.target.value)});
    }
    handleSearchClick = () => {
        let success = false;
        let book = null;
        $.ajax({
            url:"/qbook",
            data:{
                id:this.state.bid
            },
            context:document.body,
            async:false,
            type:"get",
            success:function (data) {
                if(data !== "null") {
                    success = true;
                    book = $.parseJSON(data);
                }
            }
        });
        if(success)
            this.setState({showInfo: true, name:book.name, author:book.author, language:book.language, published:book.published, price:(book.price/100).toFixed(2), stock:book.stock});
        else
            alert("No such book");
    };
    handleUpdateClick = () => {
        $.ajax({
            url:"/cbook",
            data:{
                id:this.state.bid,
                name:this.state.name,
                author:this.state.author,
                language:this.state.language,
                published:this.state.published,
                price:this.state.price * 100,
                stock:this.state.stock
            },
            context:document.body,
            async:false,
            type:"get"
        });
        alert("success");
    };
    render() {
        if(!this.state.showInfo) {
            return (
                <div className="Inf">
                    <h4>
                        <p className="Header">BookID: </p>
                        <input className="ContentInput" type="text" value={this.state.bid} onChange={this.setBid}/>
                    </h4>
                    <div className="Button3">
                        <button style={style} onClick={this.handleSearchClick}>Search</button>
                    </div>
                </div>
            );
        }
        return(
            <div className="Inf">
                <h4>
                    <p className="Header">BookID: </p>
                    <input className="ContentInput" type="text" value={this.state.bid} onChange={this.setBid}/>
                </h4>
                <div className="Button3">
                    <button style={style} onClick={this.handleSearchClick}>Search</button>
                </div>
                <h4>
                    <p className="Header">BookName: </p>
                    <input className="ContentInput" type="text" value={this.state.name} onChange={this.setName}/>
                </h4>
                <h4>
                    <p className="Header">Author: </p>
                    <input className="ContentInput" type="text" value={this.state.author} onChange={this.setAuthor}/>
                </h4>
                <h4>
                    <p className="Header">Language: </p>
                    <input className="ContentInput" type="text" value={this.state.language} onChange={this.setLanguage}/>
                </h4>
                <h4>
                    <p className="Header">Published: </p>
                    <input className="ContentInput" type="text" value={this.state.published} onChange={this.setPublished}/>
                </h4>
                <h4>
                    <p className="Header">Price: </p>
                    <input className="ContentInput" type="number" value={this.state.price} onChange={this.setPrice}/>
                </h4>
                <h4>
                    <p className="Header">Stock: </p>
                    <input className="ContentInput" type="number" value={this.state.stock} onChange={this.setStock}/>
                </h4>
                <div className="Button3">
                    <button style={style} onClick={this.handleUpdateClick}>Update</button>
                </div>
            </div>
        );
    }
}

class DeleteBook extends Component {
    constructor() {
        super();
        this.setBid = this.setBid.bind(this);
        this.state = {bid:""};
    }
    setBid(e) {
        this.setState({bid : e.target.value});
    }
    handleConfirmClick = () => {
        const confirmed = window.confirm("Sure to delete this book?");
        if(confirmed) {
            let success = false;
            $.ajax({
                url: "/dbook",
                data: {
                    id: this.state.bid,
                },
                context: document.body,
                async: false,
                type: "get",
                success: function (data) {
                    if (data !== "null")
                        success = true;
                }
            });
            if (success)
                alert("success");
            else
                alert("no such book");
        }
    };
    render() {
        return (
            <div className="Inf">
                <h4>
                    <p className="Header">BookID: </p>
                    <input className="ContentInput" type="text" value={this.state.bid} onChange={this.setBid}/>
                </h4>
                <div className="Button3">
                    <button style={style} onClick={this.handleConfirmClick}>Delete</button>
                </div>
            </div>
        );
    }
}

class BookRow extends Component {
    render() {
        const book = this.props.book;
        const book_id = book.id;
        const book_name = book.name;
        const book_author = book.author;
        const book_language = book.language;
        const book_published = book.published;
        const book_price = (Number(book.price) / 100).toFixed(2);
        const book_sales = Number(book.sales);
        const book_stock = Number(book.stock);
        return(
            <tr>
                <td>{book_id}</td>
                <td>{book_name}</td>
                <td>{book_author}</td>
                <td>{book_language}</td>
                <td>{book_published}</td>
                <td>{book_price}</td>
                <td>{book_sales}</td>
                <td>{book_stock}</td>
            </tr>
        );
    }
}

class BookTable extends Component {
    constructor(props){
        super(props);
        this.state = {data: this.props.BookData}
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
            <table>
                <thead>
                <tr>
                    <th className="t1">ID</th>
                    <th className="t1">Book</th>
                    <th className="t2">Author</th>
                    <th className="t3">Language</th>
                    <th className="t2">Published</th>
                    <th className="t4">Price</th>
                    <th className="t4">Sales</th>
                    <th className="t4">Stock</th>
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
                    <option value="language">Language</option>
                    <option value="published">Published</option>
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
                <BookTable BookData={this.props.BookData} filterText={this.state.filterText} filterHeader={this.state.filterHeader} price1={this.state.price1} price2={this.state.price2}/>
            </div>
        );
    }
}

class QueryBook extends Component {
    render() {
        let BookData = null;
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
            <FilterableBookTable BookData={BookData}/>
        );
    }
}

class ManageUser extends Component {
    render() {
        if(this.props.op === "add") {
            return(
                <AddUser/>
            );
        }
        if(this.props.op === "delete") {
            return(
                <DeleteUser/>
            );
        }
        // if(this.props.op === "ban") {
            return(
                <BanUser/>
            );
        // }
        // return(
        //     <QueryUser/>
        // );
    }
}

class ManageBook extends Component {
    render() {
        if(this.props.op === "add") {
            return(
                <AddBook/>
            );
        }
        if(this.props.op === "update") {
            return(
                <UpdateBook/>
            );
        }
        if(this.props.op === "delete") {
            return(
                <DeleteBook/>
            );
        }
        return(
            <QueryBook/>
        );
    }
}

class ManageSales extends Component {
    render() {
        return(
            <h3>Coming Soon</h3>
        );
    }
}

class Manage extends Component {
    render() {
        if(this.props.obj === "null") {
            return (
                <h2>Welcome!</h2>
            );
        }
        if(this.props.obj === "user") {
            return (
                <ManageUser op={this.props.op}/>
            );
        }
        if(this.props.obj === "book") {
            return (
                <ManageBook op={this.props.op}/>
            );
        }
        return(
            <ManageSales/>
        );
    }
}

class Admin extends Component {
    constructor() {
        super();
        this.state = {redirect: false}
    }
    obj = "null";
    op = "null";
    ChangeObjOp(obj, op, event) {
        this.obj = obj;
        this.op = op;
    }
    render() {
        let isAdmin = false;
        $.ajax({
            url:"/checkstate",
            context:document.body,
            async:false,
            type:"get",
            success: function(data) {
                if(data === "admin") {
                    isAdmin = true;
                }
            }
        });
        if(isAdmin) {
            setAdmin(true);
        }
        else {
            setAdmin(false);
            alert("Not admin!");
            this.setState({redirect:true});
        }
        if(this.state.redirect) {
            return (
                <Redirect push to="/booklist"/>
            );
        }
        return(
            <div>
                <div className="Sidebar">
                    <dl>
                        <dt>Manage books</dt>
                        <dd><a href="#" onClick={this.ChangeObjOp.bind(this,"book","add")}>Add book</a></dd>
                        <dd><a href="#" onClick={this.ChangeObjOp.bind(this,"book","update")}>Update book info</a></dd>
                        <dd><a href="#" onClick={this.ChangeObjOp.bind(this,"book","delete")}>Delete book</a></dd>
                        <dd><a href="#" onClick={this.ChangeObjOp.bind(this,"book","query")}>Query book</a></dd>
                    </dl>
                    <dl>
                        <dt>Manage users</dt>
                        <dd><a href="#" onClick={this.ChangeObjOp.bind(this,"user","add")}>Add user</a></dd>
                        <dd><a href="#" onClick={this.ChangeObjOp.bind(this,"user","delete")}>Delete user</a></dd>
                        <dd><a href="#" onClick={this.ChangeObjOp.bind(this,"user","ban")}>Ban user</a></dd>
                        <dd><a href="#" onClick={this.ChangeObjOp.bind(this,"user","query")}>Query user</a></dd>
                    </dl>
                    {/*<dl>*/}
                        {/*<dt>Sales statistics</dt>*/}
                        {/*<dd><a href="#" onClick={this.ChangeObjOp.bind(this,"sales","query")}>Statistics</a></dd>*/}
                    {/*</dl>*/}
                </div>
                <div className="ShowRight">
                    <Manage obj={this.obj} op={this.op}/>
                </div>
            </div>
        );
    }
}

export default Admin;