import React from "react";
import ReactDOM from "react-dom";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";

import store from "./store";
import { Provider, connect } from "react-redux";
import { setUser, clearUser } from "./store/actions";

import App from "./components/app/App";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Spinner from "./Spinner";

import firebase from "firebase";

import "semantic-ui-css/semantic.min.css";

class Root extends React.Component {
  componentDidMount() {
    const { setUser, clearUser, history } = this.props;
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        history.push("/");
        setUser(user);
      } else {
        history.push("/login");
        clearUser();
      }
    });
  }

  render() {
    const { isLoading } = this.props;
    return isLoading ? (
      <Spinner />
    ) : (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  isLoading: user.isLoading,
});

const RootWithAuth = withRouter(
  connect(mapStateToProps, { setUser, clearUser })(Root)
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);
