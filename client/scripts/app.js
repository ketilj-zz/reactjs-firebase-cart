var React = require('react'),
Router = require('react-router'),
Route = Router.Route,
Routes = Router.Routes,
Redirect = Router.Redirect,
DefaultRoute = Router.DefaultRoute,
NotFoundRoute = Router.NotFoundRoute,
RouteHandler = Router.RouteHandler,
Link = Router.Link;

var Products= require('./index.js');

var routes = (
  <Route name="/" handler={Layout}>
    <Route name="/products" handler={Products} />
    <DefaultRoute handler={Products} />
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});