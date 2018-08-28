import React, { Component } from 'react';
import './App.css';
import rating from './rating';

class App extends Component {
  state = {
    owner: '',
    products: []
  }; 

  async componentDidMount() {
    const owner = await rating.methods.owner().call();
    this.setState({owner});

    const productCount = await rating.methods.productCount().call();
    let products = [];
    for(let i = 0; i < productCount; i++) {
      let p = await rating.methods.getProduct(i).call();
      products.push(p);
    }
    this.setState({products});

    console.log(products);
  }

  render() {
    return (
      <div className="title">
        <h2>Rating Contract</h2>
        <p>Owner: {this.state.owner}</p>
      </div>
    );
  }
}

export default App;
