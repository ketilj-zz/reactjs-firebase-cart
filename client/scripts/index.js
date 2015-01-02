var React = require('react'),
Router = require('react-router'),
ReactFireMixin = require('reactfire'),
FireBase = require('firebase'),
FirebaseTokenGenerator = require("firebase-token-generator"),
Prismic = require('../prismic-helpers'),
_ = require('lodash'),

EventEmitter = require('events').EventEmitter;

var eventer = new EventEmitter();
var tokenGenerator = new FirebaseTokenGenerator("q3P7IIdyz1r8kHiL9Lk3LqKMqUJPvSgtPl6e5Kqj");

/** @jsx React.DOM */

var ProductCategoryRow = React.createClass({
    render: function() {
        return (<tr><th colSpan="2">{this.props.category}</th></tr>);
    }
});




var ProductRow = React.createClass({

    getInitialState: function() {
      return {
        added: false
      };
    },

    
    addToCart: function(e) {
      // if(!this.state.added) {
      //   console.log("product added " + this.props.product.hardwareProduct.model);
      //   eventer.emit("CartItemAdded", null, this.props.product);
      // }
      // else {
      //   // remove
      //   //$.publish('cart.removed', this.props.data.id);
      //   alert("item removed");
      // }

      // this.setState({
      //   added: !this.state.added
      // });
      console.log("product added " + this.props.product.hardwareProduct.model);
      eventer.emit("CartItemAdded", null, this.props.product);
    },
    

    render: function() {
        var product = this.props.product;

        var name = this.props.product.stocked ?
            this.props.product.hardwareProduct.model :
            <span style={{color: 'red'}}>
                {this.props.product.hardwareProduct.model}
            </span>;
        return (
            <div className="thumbnail">
              <img src="" alt="product image" />
              <div className="caption clearfix">
                <h3><a href="">{name}</a></h3>
                <div className="product__price">
                  {this.props.product.price}
                </div>
                <div className="product__button-wrap">
                  <button className={this.state.added ? 'btn btn-danger' : 'btn btn-primary'} onClick={this.addToCart}>
                    {this.state.added ? 'Remove' : 'Add to cart'}
                  </button>
                </div>
              </div>
          </div>
        );
    }
});

var ProductsList = React.createClass({
    render: function() {

        var rows = [];
        var lastCategory = null;
        this.props.products.forEach(function(product) {
            
            rows.push(<ProductRow product={product} key={product.navn} />);
            lastCategory = product.category;
        });
        return (
            <ul className="clearfix">
              {rows}
            </ul>
        );

    }
});


/*
var ProductTable = React.createClass({
  render: function() {
        var rows = [];
        var lastCategory = null;
        this.props.products.forEach(function(product) {
            
            rows.push(<ProductRow product={product} key={product.navn} />);
            lastCategory = product.category;
        });
        return (
            <table>
                <thead>
                    <tr>
                        <th>Navn</th>
                        <th>Pris</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
});
*/
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
  componentWillMount: function() {
    //this.bindAsArray(new Firebase("https://ketilshop.firebaseio.com/Items/"), "products");
    // Setup our ajax request
    // var request = new XMLHttpRequest(), self = this;
    // request.open('JSONP', 'http://iplst01z.netcom.no:9230/pricemaster/service/hardwareListPrice/1/netcom/INT_STORE/KSA1?callback=JSON_CALLBACK&customerGroup=PC', true);
    // request.onload = function() {

    //   // If everything is cool...
    //   if (request.status >= 200 && request.status < 400){

    //     // Load our next page
    //     self.loadProducts(JSON.parse(request.responseText));

    //   } else {

    //     // Set application state (Not paging, paging complete)
    //     self.setState({paging: false, done: true});

    //   }
    // };

    // // Fire!
    // request.send();
    Prismic.Api('https://lesbonneschoses-vjpkpyoaaccabmbn.prismic.io/api', function (err, Api) {
    Api.form('everything')
        .ref(Api.master())
        .query(Prismic.Predicates.at("document.type", "product")).submit(function (err, response) {
            if (err) {
                console.log(err);
                done();
            }
            // The documents object contains a Response object with all documents of type "product".
            var page = response.page; // The current page number, the first one being 1
            var results = response.results; // An array containing the results of the current page;
            // you may need to retrieve more pages to get all results
            var prev_page = response.prev_page; // the URL of the previous page (may be null)
            var next_page = response.next_page; // the URL of the next page (may be null)
            var results_per_page = response.results_per_page; // max number of results per page
            var results_size = response.results_size; // the size of the current page
            var total_pages = response.total_pages; // the number of pages
            var total_results_size = response.total_results_size; // the total size of results across all pages
        });
}   );
  },

  componentWillUnmount: function() {
    this.firebaseRef.off();
  },

    
  
  render: function() {
        return (
            <div className="col-md-8">
              <h2>Produkter</h2>
              <SearchBar />
              <ProductsList products={this.state.products} />
            </div>
        );
    },
});

function calculateCartItemTotal(price, quantity) {
  return price * quantity;
}

var CartItem = React.createClass( {
  render: function() {
    return (
      <div>
        <strong>{this.props.itemName}</strong> x { this.props.quantity } { String.fromCharCode(8212) } 
        { calculateCartItemTotal(this.props.price, this.props.quantity).toFixed(2)}
      </div>
    ); 
  } 
})

var Cart = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function() {
      return {
        Cartitems: [], 
        user: {}
      };
  },

  componentWillMount: function() {
    eventer.on("CartItemAdded", function productAddedToCart(e, product) {
      this.updateCart(product);
    }.bind(this));


    
    var token = tokenGenerator.createToken({uid: "4797172271", firstName: "Ketil", lastName: "Jensen"});
    console.log("token generated " + token)
    var ref = new Firebase("https://ketilshop.firebaseio.com");

    ref.authWithCustomToken(token, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Login Succeeded!", authData); 
        this.setState({
          user: authData.auth
        });

        var url = "https://ketilshop.firebaseio.com/Cartitems/" + authData.auth.uid;
        console.log("url " + url);
        this.bindAsArray(new Firebase(url), "Cartitems");
        
      }
       
    }.bind(this));

    
    
  },

  componentWillUnmount: function() {
    this.firebaseRef.off();
  },

  updateCart: function(product) {
    console.log("item with product name " + product.hardwareProduct.model + " was added. Price " + product.price);
    var cartItems = [];
    console.table(this.state.Cartitems);
    var cartItemRef = this.firebaseRefs["Cartitems"].child("-JcBgUxkuGUXHweoB3qq");
    var cartItemQuantity = _.where(cartItems, function findByProductId(cartItem){
      return product.hardwareProduct.model == cartItem.productId;
    }).length;
    var test = product.hardwareProduct.model;

    if (cartItemQuantity == 0) {
      this.firebaseRefs["Cartitems"].push({
         productId: product.hardwareProduct.model,
         name: product.hardwareProduct.model,
         price: product.price,
         quantity: 1
       
      });
    } else {

      var upvotesRef = new Firebase('https://ketilshop.firebaseio.com/Cartitems/4797172278/-JcArzi43peR0jy_s5qJ/quantity');
      upvotesRef.transaction(function (quantity) {
        return (quantity || 0) + 1;
      });
      var existingCartItem = _.find(cartItems, function findCartItem(cartItem) {
        return cartItem.productId == product.hardwareProduct.model;
      });
      existingCartItem.quantity += 1;

    }

    this.setState({cartItems: cartItems});
  },

  calculateTotal: function() {
    function addLineItemTotal(total, lineItem) {
      return total += calculateCartItemTotal(lineItem.price, lineItem.quantity);
    }
    return _.reduce(this.state.Cartitems, addLineItemTotal, 0);
  },

  render: function() {
    var cartItems = this.state.Cartitems.map(function renderCartItem(cartItem) {
      return <CartItem itemName = { cartItem.name} quantity={ cartItem.quantity} price={cartItem.price} />
    })
    if (this.user){
      return (
        <div className="col-md-4">
          <h3>Your cart</h3>
          { cartItems.length == 0 ? "Your cart is empty" : cartItems}
          <hr/>
          <div><strong>Total:</strong> { "$" + this.calculateTotal().toFixed(2)}</div>
        </div>
      );
    } else {
        return (
          <h3>Not logged in</h3>
        );
    }
  }
});

React.render(<FilterableProductTable/>, document.getElementById("product-listing"));
React.render(<Cart/>, document.getElementById("shopping-cart"));