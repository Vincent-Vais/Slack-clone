import React from "react";

import { Link } from "react-router-dom";

import firebase from "../../firebase";

import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    error: "",
    loading: false,
  };

  handleInputError = (name) =>
    this.state.error.toLowerCase().includes(name) ? "error" : "";

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = this.state;

    this.setState({
      loading: true,
    });

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user);
        this.setState({
          email: "",
          password: "",
          error: "",
          loading: false,
        });
      })
      .catch((err) => this.setState({ error: err.message, loading: false }));
  };

  render() {
    const { email, password, error, loading } = this.state;
    return (
      <Grid className="app" textAlign="center" verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          {error && (
            <Message color="red" inverted>
              {error}
            </Message>
          )}
          <Header as="h2" icon color="violet" textAlign="center">
            <Icon name="code branch" color="violet" />
            Login to Dev Chat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email"
                type="email"
                onChange={this.handleChange}
                value={email}
                className={this.handleInputError("email")}
                required
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                onChange={this.handleChange}
                value={password}
                className={this.handleInputError("password")}
                required
              />
              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                fluid
                color="violet"
                size="large"
                type="submit"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          <Message>
            Do not have an account?
            <Link to="/register">Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
