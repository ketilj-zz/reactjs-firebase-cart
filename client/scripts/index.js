var React = require('react'),
ReactFireMixin = require('reactfire'),
Prismic = require("prismic.io").Prismic,
Router = require('react-router'),
Cart = require('./cart.js'),
ProductList = require('./productlist');


var Link = Router.Link,
    Route = Router.Route, 
    RouteHandler = Router.RouteHandler;


/** @jsx React.DOM */

var SearchBar = React.createClass({
    render: function() {
        return (
            <form>
                <input type="text" placeholder="Søk..." />
                <p>
                    <input type="checkbox" />
                    Only show products in stock
                </p>
            </form>
        );
    }
});

var FilterableProductTable = React.createClass({
  mixins: [ReactFireMixin],
  
  getInitialState: function() {
    return {products: [], text: ""};
  },
  // componentWillMount: function() {
  //   this.bindAsArray(new Firebase("https://ketilshop.firebaseio.com/Items/"), "products");
  // },

  componentDidMount: function() {
    var self = this;
    Prismic.Api('http://lesbonneschoses-vjpkpyoaaccabmbn.prismic.io/api', function (err, Api) {
      Api.form('everything')
        .ref(Api.master())
        .query(Prismic.Predicates.at("document.type", "product")).submit(function (err, response) {
            if (err) {
                console.log(err);
                done();
            }

            if (self.isMounted()) {
              self.setState({
                products: response.results
              });
            }
        });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.firebaseRef.off();
  },
  
  render: function() {
        return (
            
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <h1>Nettbutikk demo</h1>
                </div>
              </div>
              <div className="row">
                 <div className="col-md-8">
                  <h2>Produkter</h2>
                  <SearchBar />
                  <ProductList products={this.state.products} />
                </div>
                <div className="col-md-4">
                  <Cart />
                </div>
              </div>
            </div> 
           
        );
    },
});

React.render(<FilterableProductTable/>, document.getElementById("product-listing"));
//React.render(<Cart/>, document.getElementById("shopping-cart"));