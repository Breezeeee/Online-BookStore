import React , {Component} from 'react';
import '../css/css.css';
import { Link, Redirect } from 'react-router-dom';
import $ from 'jquery';
import {setAdmin, setLogin} from "../index";
import {Button, Table, FormGroup, ControlLabel, FormControl, Navbar} from 'react-bootstrap';

class ItemRow extends Component {
    render() {
        const item = this.props.item;
        const bname = item.bname;
        const bauthor = item.bauthor;
        const price = (Number(item.price) / 100).toFixed(2);
        const num = item.num;
        const subtotal = (Number(item.subtotal) / 100).toFixed(2);
        return(
            <tr>
                <td>{bname}</td>
                <td>{bauthor}</td>
                <td>{price}</td>
                <td>{num}</td>
                <td>{subtotal}</td>
            </tr>
        );
    }
}

class SubItem extends Component {
    render() {
        let Items = null;
        $.ajax({
            url:"/qorder2",
            data:{
                id:this.props.oid
            },
            context:document.body,
            async:false,
            type:"get",
            success: function(data) {
                Items = $.parseJSON(data);
            }
        });
        const rows = [];
        Items.forEach((item) => {
            rows.push(<ItemRow item={item}/>);
        });
        return(
            <tbody>{rows}</tbody>
        )
    }
}

class OrderRow extends Component {
    render() {
        const order = this.props.order;
        const order_id = order.id;
        const order_total = (Number(order.total) / 100).toFixed(2);
        const order_date = order.date;
        const order_info = "OrderID: " + order_id + "    Date: " + order_date + "    Total: " + order_total + "    ";
        return(
            <div className="Orders">
                <div className="panel panel-info">
                    <div className="panel-heading">
                        <h3 className="panel-title">{order_info}</h3>
                        </div>
                    <div className="panel-body">
                        <Table striped bordered condensed hover>
                            <tr>
                                <th className="t1">Book</th>
                                <th className="t5">Author</th>
                                <th className="t4">Price</th>
                                <th className="t4">Number</th>
                                <th className="t4">SubTotal</th>
                            </tr>
                            <SubItem oid={order_id}/>
                        </Table>
                        <Button><Link to={{pathname:"/orderinfo", state:{oid: order_id}}}>MoreInfo</Link></Button>
                    </div>
                </div>
            </div>
        );
    }
}

class OrderTable extends Component {

    render() {
        const filterText = this.props.filterText;
        const rows = [];
        this.props.orders.forEach((order) => {
            if (order.id.toLowerCase().indexOf(filterText.toLowerCase()) === -1)
                return;
            rows.push(<OrderRow order={order}/>)
        });
        return(
            <div className="col-md-10 col-md-offset-1">{rows}</div>
        )
    }
}

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    }
    handleFilterTextChange(e) {
        this.props.onFilterTextChange(e.target.value);
    }
    render() {
        return (
            <Navbar.Form>
                <FormGroup>
                    <ControlLabel>Search</ControlLabel>
                    {' '}
                    <FormControl type="text" placeholder="OrderID" value={this.props.filterText} onChange={this.handleFilterTextChange}/>
                </FormGroup>
            </Navbar.Form>
        );
    }
}

class MoreSearch extends Component {
    constructor(props) {
        super(props);
        this.handleFilterBookChange = this.handleFilterBookChange.bind(this);
        this.handleFilterAuthorChange = this.handleFilterAuthorChange.bind(this);
        this.handleDate1Change = this.handleDate1Change.bind(this);
        this.handleDate2Change = this.handleDate2Change.bind(this);
    }
    handleFilterBookChange(e) {
        this.props.onFilterBookChange(e.target.value);
    }
    handleFilterAuthorChange(e) {
        this.props.onFilterAuthorChange(e.target.value);
    }
    handleDate1Change(e) {
        this.props.onDate1Change(e.target.value);
    }
    handleDate2Change(e) {
        this.props.onDate2Change(e.target.value);
    }
    render() {
        return (
            <Navbar.Form>
                <FormGroup>
                    <ControlLabel>Book</ControlLabel>
                    {' '}
                    <FormControl type="text" placeholder="Book" value={this.props.filterBook} onChange={this.handleFilterBookChange}/>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Author</ControlLabel>
                    {' '}
                    <FormControl type="text" placeholder="Author" value={this.props.filterAuthor} onChange={this.handleFilterAuthorChange}/>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Date</ControlLabel>
                    {' '}
                    <FormControl type="datetime-local" placeholder="from" value={this.props.date1} onChange={this.handleDate1Change}/>
                    <ControlLabel>-</ControlLabel>
                    {' '}
                    <FormControl type="datetime-local" placeholder="to" value={this.props.date2} onChange={this.handleDate2Change}/>
                </FormGroup>
            </Navbar.Form>
        );
    }
}

class FilterableOrderTable extends Component {
    constructor(props){
        super(props);
        this.state = {filterText: '', ShowMore: false, orders:props.orders, filterBook:'', filterAuthor:'', date1:'2018-01-01T00:00', date2:'2020-01-01T00:00'};
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
        this.handleFilterBookChange = this.handleFilterBookChange.bind(this);
        this.handleFilterAuthorChange = this.handleFilterAuthorChange.bind(this);
        this.handleFilterDate1Change = this.handleFilterDate1Change.bind(this);
        this.handleFilterDate2Change = this.handleFilterDate2Change.bind(this);
    }
    handleFilterTextChange(filterText) {
        this.setState({ filterText: filterText });
    }
    handleFilterBookChange(filterText) {
        this.setState({ filterBook: filterText });
    }
    handleFilterAuthorChange(filterText) {
        this.setState({ filterAuthor: filterText });
    }
    handleFilterDate1Change(filterText) {
        this.setState({ date1: filterText });
    }
    handleFilterDate2Change(filterText) {
        this.setState({ date2: filterText });
    }
    handleMoreClick = () => {
        this.setState({ShowMore: true})
    };
    handleLessClick = () => {
        this.setState({ShowMore: false})
    };
    handleConfirmClick = () => {
        const book = this.state.filterBook;
        const author = this.state.filterAuthor;
        let date1 = this.state.date1;
        let date2 = this.state.date2;
        const Date1 = date1.split('T');
        const Date2 = date2.split('T');
        date1 = Date1[0] + " " + Date1[1] + ":00";
        date2 = Date2[0] + " " + Date2[1] + ":00";
        let Orders = null;
        $.ajax({
            url:"/qorder4",
            data:{
                date1:date1,
                date2:date2,
                book:book,
                author:author
            },
            context:document.body,
            async:false,
            type:"get",
            success:function(data){
                Orders = $.parseJSON(data);
            }
        });
        this.setState({orders: Orders});
    };
    handleClearClick = () => {
        let Orders = null;
        $.ajax({
            url:"/qorder1",
            context:document.body,
            async:false,
            type:"get",
            success:function(data){
                Orders = $.parseJSON(data);
            }
        });
        this.setState({orders: Orders, filterText: '', filterBook:'', filterAuthor:'', date1:'2018-01-01T00:00', date2:'2020-01-01T00:00'});
    };
    render() {
        if(!this.state.ShowMore) {
            return (
                <div>
                    <div className="MoreSearch">
                        <SearchBar filterText={this.state.filterText} onFilterTextChange={this.handleFilterTextChange}/>
                        <Button bsStyle="primary" onClick={this.handleMoreClick}>More</Button>
                    </div>
                    <OrderTable orders={this.props.orders} filterText={this.state.filterText}/>
                </div>
            );
        }
        return(
            <div>
                <div className="MoreSearch">
                    <SearchBar filterText={this.state.filterText} onFilterTextChange={this.handleFilterTextChange}/>
                </div>
                <div className="MoreSearch">
                    <MoreSearch filterBook={this.state.filterBook} filterAuthor={this.state.filterAuthor} date1={this.state.date1} date2={this.state.date2} onDate1Change={this.handleFilterDate1Change} onDate2Change={this.handleFilterDate2Change} onFilterBookChange={this.handleFilterBookChange} onFilterAuthorChange={this.handleFilterAuthorChange}/>
                    <Button bsStyle="success" onClick={this.handleConfirmClick}>Confirm</Button>
                    {" "}
                    <Button bsStyle="success" onClick={this.handleClearClick}>Clear</Button>
                    {" "}
                    <Button bsStyle="primary" onClick={this.handleLessClick}>Less</Button>
                </div>
                <OrderTable orders={this.state.orders} filterText={this.state.filterText}/>
            </div>
        );
    }
}

class OrderList extends Component {
    constructor() {
        super();
        this.state = {redirect:false};
    }
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
            this.setState({redirect:true});
        }
        if(isAdmin) {
            setAdmin(true);
        }
        else {
            setAdmin(false);
        }
        let allOrders = null;
        $.ajax({
            url:"/qorder1",
            context:document.body,
            async:false,
            type:"get",
            success:function(data){
                allOrders = $.parseJSON(data);
            }
        });
        if(this.state.redirect)
            return(
                <Redirect push to="/login"/>
            );
        return (
            <FilterableOrderTable orders={allOrders}/>
        );
    }
}

export default OrderList;