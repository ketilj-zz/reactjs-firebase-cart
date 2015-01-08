var React = require('react'),
ProductRow = require('./productrow');

var ProductList = React.createClass({
  render: function() {

    var rows = [];
    var lastCategory = null;
    this.props.products.forEach(function(Document) {
        
        rows.push(<ProductRow product={Document} key={Document.slug} />);
        //lastCategory = product.category;
    });
    return (
        <ul className="clearfix">
          {rows}
        </ul>
    );

  }
});

module.exports = ProductList;