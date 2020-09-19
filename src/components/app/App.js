import React from "react";
import { Grid } from "semantic-ui-react";
import "./App.css";

import { connect } from "react-redux";

import firebase from "../../firebase";

import ColorPanel from "../color-panel/ColorPanel";
import SidePanel from "../side-panel/SidePanel";
import Messages from "../messages/Messages";
import MetaPanel from "../meta-panel/MetaPanel";
import Spinner from "../../Spinner";

import { setCurrentChannel } from "../../store/actions";

class App extends React.Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
  };

  handleChannelChange = (channel) => {
    const { setCurrentChannel } = this.props;
    setCurrentChannel(channel);
  };

  render() {
    const { messagesRef } = this.state;
    const {
      currentChannel,
      isPrivate,
      currentUser,
      userPosts,
      primaryColor,
      secondaryColor,
    } = this.props;
    return (
      <Grid
        columns="equal"
        className="app"
        style={{ backgroundColor: secondaryColor }}
      >
        <ColorPanel
          key={currentUser && currentUser.name}
          currentUser={currentUser}
        />
        <SidePanel
          onChannelChange={this.handleChannelChange}
          currentChannel={currentChannel}
          currentUser={currentUser}
          primaryColor={primaryColor}
        />
        <Grid.Column
          style={{
            width: "auto",
            display: "flex",
            flexDirection: "column",
            height: "100vh",
          }}
        >
          {currentChannel && messagesRef ? (
            <Messages
              key={currentChannel && currentChannel.id}
              currentUser={currentUser}
              currentChannel={currentChannel}
              messagesRef={messagesRef}
              isPrivate={isPrivate}
            />
          ) : (
            <Spinner />
          )}
        </Grid.Column>
        <Grid.Column>
          <MetaPanel
            key={currentChannel && currentChannel.name}
            isPrivate={isPrivate}
            currentChannel={currentChannel}
            userPosts={userPosts}
          />
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = ({ channel, user: { currentUser }, colors }) => ({
  currentChannel: channel.currentChannel,
  isPrivate: channel.isPrivate,
  userPosts: channel.userPosts,
  currentUser,
  primaryColor: colors.primaryColor,
  secondaryColor: colors.secondaryColor,
});

export default connect(mapStateToProps, { setCurrentChannel })(App);
