import React from "react";

import md5 from "md5";

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

class Register extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    error: "",
    loading: false,
    usersRef: firebase.database().ref("users"),
  };

  handleInputError = (name) =>
    this.state.error.toLowerCase().includes(name) ? "error" : "";

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  saveUser = (createdUser) => {
    const { usersRef } = this.state;
    const { user } = createdUser;
    const { displayName, photoURL, uid } = user;
    return usersRef.child(uid).set({
      name: displayName,
      avatar: photoURL,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { username, email, password, passwordConfirmation } = this.state;
    if (password !== passwordConfirmation) {
      this.setState({ error: "Passwords do not match" });
    } else {
      this.setState({
        loading: true,
      });
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((createdUser) => {
          createdUser.user
            .updateProfile({
              displayName: username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`,
            })
            .then(() => this.saveUser(createdUser))
            .then(() =>
              this.setState({
                username: "",
                email: "",
                password: "",
                passwordConfirmation: "",
                error: "",
                loading: false,
              })
            );
        })
        .catch((err) => this.setState({ error: err.message, loading: false }));
    }
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      error,
      loading,
    } = this.state;
    return (
      <Grid className="app" textAlign="center" verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          {error && (
            <Message color="red" inverted>
              {error}
            </Message>
          )}
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for Dev Chat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                type="text"
                onChange={this.handleChange}
                value={username}
                className={this.handleInputError("user")}
                required
              />
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
              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                type="password"
                onChange={this.handleChange}
                value={passwordConfirmation}
                className={this.handleInputError("password")}
                required
              />
              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                fluid
                color="orange"
                size="large"
                type="submit"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          <Message>
            Already a user?
            <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
