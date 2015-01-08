var React = require('react'),
EventEmitter = require('events').EventEmitter;

var eventer = new EventEmitter();

var ProductRow = React.createClass({

    getInitialState: function() {
      return {
        added: false
      };
    },

    
    addToCart: function(e) {
      eventer.emit("CartItemAdded", null, this.props.product);
    },
    

    render: function() {
        //var product = this.props.product;
        var name = this.props.product.slug;
        var price = this.props.product.getNumber("product.price");
        var image = this.props.product.getImage("product.image");
        // var name = this.props.product.stocked ?
        //     this.props.product.hardwareProduct.model :
        //     <span style={{color: 'red'}}>
        //         {this.props.product.hardwareProduct.model}
        //     </span>;
        return (
            <div className="thumbnail">
              <img src={image.main.url} alt="product image" />
              <div className="caption clearfix">
                <h3>{name}</h3>
                <div className="product__price">
                  {price}
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

module.exports = ProductRow;