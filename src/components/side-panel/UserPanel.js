import React from "react";
import { connect } from "react-redux";
import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
  Modal,
  Input,
  Button,
} from "semantic-ui-react";
import firebase from "../../firebase";

class UserPanel extends React.Component {
  handleSignOut = () => {
    firebase.auth().signOut();
  };
  dropdownOptions = () => [
    {
      text: (
        <span>
          Signed in as <strong>{this.props.name}</strong>
        </span>
      ),
      disabled: true,
      key: "user",
    },
    {
      text: <span onClick={this.openModal}>Change avatar</span>,
      key: "avatar",
    },
    {
      text: <span onClick={this.handleSignOut}>Sign Out</span>,
      key: "auth",
    },
  ];

  render() {
    const { primaryColor } = this.props;
    return (
      <Grid style={{ backgroundColor: primaryColor }}>
        <Grid.Column>
          {/* App header */}
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            <Header inverted floated="left" as="h2">
              <Icon name="code" />
              <Header.Content>DevChat</Header.Content>
            </Header>
          </Grid.Row>
          {/* User Dropdown */}
          <Header as="h4" inverted style={{ padding: "0.25em" }}>
            <Dropdown
              trigger={
                <span>
                  <Image src={this.props.avatar} spaced="right" avatar />
                </span>
              }
              options={this.dropdownOptions()}
            ></Dropdown>
          </Header>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = ({ user }) => {
  if (!user.currentUser) return { name: null, avatar: null };
  return {
    name: user.currentUser.displayName,
    avatar: user.currentUser.photoURL,
  };
};

export default connect(mapStateToProps)(UserPanel);
