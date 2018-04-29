import React , {Component} from 'react';
import '../css/css.css';
import { Link, Redirect } from 'react-router-dom';
import $ from 'jquery';
import {setLogin} from "../index";
import {style} from "./style";

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
            <div>
                <table>
                <td0>{order_info}</td0>
                <td0><Link to={{pathname:"/orderinfo", state:{oid: order_id}}} style={style}>MoreInfo</Link></td0>
                <div>
                    <tr>
                        <th className="t1">Book</th>
                        <th className="t5">Author</th>
                        <th className="t4">Price</th>
                        <th className="t4">Number</th>
                        <th className="t4">SubTotal</th>
                    </tr>
                <SubItem oid={order_id}/>
                </div>
                </table>
            </div>
        );
    }
}

class OrderTable extends Component {
    constructor(props){
        super(props);
        this.state = {data: props.orders}
    }
    render() {
        const filterText = this.props.filterText;
        const rows = [];
        this.state.data.forEach((order) => {
            if (order.id.toLowerCase().indexOf(filterText.toLowerCase()) === -1)
                return;
            rows.push(<OrderRow order={order}/>)
        });
        return(
            <table>{rows}</table>
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
            <div className="SearchBarInput2">
                Search
                <input type="text" placeholder="OrderID" value={this.props.filterText} onChange={this.handleFilterTextChange} />
            </div>
        );
    }
}

class FilterableOrderTable extends Component {
    constructor(props){
        super(props);
        this.state = {filterText: ''};
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    }
    handleFilterTextChange(filterText) {
        this.setState({ filterText: filterText });
    }
    render() {
        return (
            <div>
                <SearchBar filterText={this.state.filterText} onFilterTextChange={this.handleFilterTextChange}/>
                <OrderTable orders={this.props.orders} filterText={this.state.filterText}/>
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
            alert("Please login first");
            this.setState({redirect:true});
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