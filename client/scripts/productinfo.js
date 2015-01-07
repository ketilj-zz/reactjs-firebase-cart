var React = require('react');

var ProductInfo = React.createClass({

  render: function(){
    return (<h1>ProductInfo</h1>);
  }

});

React.render(<ProductInfo/>, document.getElementById("product-info"));