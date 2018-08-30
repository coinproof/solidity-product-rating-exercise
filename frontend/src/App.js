import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import rating from './rating';

class App extends Component {
  state = {
    owner: '',
    products: [],
    productCount: 0,
    pageSize: 5,
    currPage: 0,
    lastPage: false,
    newProductName: '',
    accounts: '',
    status: ''
  };

  async componentDidMount() {
    if(!web3) return;
    this.setState({accounts: await web3.eth.getAccounts()});
    this.setState({owner: await rating.methods.owner().call()});

    this.getPage(0);
  }

  async getPage(page) {
    if(page < 0) return;

    this.setState({lastPage: false});
    this.setState({productCount: await rating.methods.productCount().call()});
    const skip = page * this.state.pageSize;
    let limit = skip + this.state.pageSize;

    if(skip > this.state.productCount)
      return;
    if(limit > this.state.productCount){
      limit = this.state.productCount;
      this.setState({lastPage: true});
    }

    let products = [];
    this.setState({products});
    for(let i = skip; i < limit; i++) {
      let p = await rating.methods.getProduct(i).call({from: this.state.accounts[0]});
      products.push(p);
      this.setState({products});
    }

    this.setState({currPage: page});

    console.log('products', this.state.products);
  }

  addProduct = async (event) => {
    event.preventDefault();

    this.setState({status: 'Adding product...'});
    await rating.methods.addProduct(this.state.newProductName).send({from: this.state.accounts[0]});
    this.setState({status: 'Product added!'});
  }

  addReview = async (event) => {
    event.preventDefault();

    let productId = event.target.value;
    let productRating = window.prompt("Choose a rating between 0 and 5:");

    if(!productRating) return;

    if(!isNaN(productRating) && Number.isInteger(+productRating) && productRating >= 0 && productRating <= 5) {
      this.setState({status: 'Adding review...'});
      let x = await rating.methods.addReview(productId, productRating).send({from: this.state.accounts[0]});
      console.log("oq voltou", x);
      this.setState({status: 'Review added!'});
    } else
      this.setState({status: 'Invalid rating!'});
  }

  render() {
    if(!web3) return (
      <div>
        You need to install the MetaMask extension.
      </div>
    );
    
    return (
      <div>
        <div className="jumbotron">
          <h2>Rating Contract</h2>      
          <p>The owner of this contract is: {this.state.owner}</p>
        </div>
        {this.state.owner === this.state.accounts[0] ?
          <form onSubmit={this.addProduct}>
            <div class="input-group input-group-sm mb-3">
              <input placeholder="Type product name..." value={this.state.newProductName} onChange={event => {this.setState({newProductName: event.target.value})}} type="text" class="form-control" aria-describedby="inputGroup-sizing-sm"/>
              <button className="btn btn-primary">Add new product</button>
            </div>
          </form> : null
          }
        <p><b>Products:</b></p>
        <ul className="list-group">
          {this.state.products.length ? null : <li>Loading...</li>}
          {this.state.products.map(p => 
            <li className="list-group-item" key={p.id}>
              <button disabled={p.hasReviewed} type="button" className="bt-review btn btn-info" value={p.id} onClick={this.addReview}>Review this product</button>
              <p className="product-info">{(p.avgRating/10).toFixed(1)} - {p.title}</p>
            </li>
          )}
        </ul>
        <div className="pagination">
          <button type="button" className="btn btn-secondary" disabled={this.state.currPage === 0} onClick={event => this.getPage(this.state.currPage - 1)}>&lt;</button>
          Page: {this.state.currPage+1}
          <button type="button" className="btn btn-secondary" disabled={this.state.lastPage} onClick={event => this.getPage(this.state.currPage + 1)}>&gt;</button>
        </div>
        <h3>{this.state.status}</h3>
      </div>
    );
  }
}

export default App;
