import React from "react";
import firebase from "../../firebase";
import { Menu, Icon } from "semantic-ui-react";
import { useStore } from "react-redux";

import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../store/actions";

class DirectMessages extends React.Component {
  state = {
    activeChannel: "",
    users: [],
    user: this.props.currentUser,
    usersRef: firebase.database().ref("users"),
    connected: firebase.database().ref(".info/connected"),
    presenceRef: firebase.database().ref("presence"),
  };

  componentDidMount() {
    const { user } = this.state;
    if (!user) return;
    this.addListeners(user.uid);
  }

  componentWillUnmount() {
    this.state.usersRef.off();
    this.state.presenceRef.off();
    this.state.connected.off();
  }

  addListeners = (id) => {
    const { usersRef, connected, presenceRef } = this.state;
    let loadedUsers = [];
    usersRef.on("child_added", (snap) => {
      if (snap.key !== id) {
        let user = snap.val();
        user["uid"] = snap.key;
        user["status"] = "offline";
        loadedUsers.push(user);
        this.setState({ users: loadedUsers });
      }
    });

    connected.on("value", (snap) => {
      if (snap.val() === true) {
        const ref = presenceRef.child(id);
        ref.set(true);
        ref.onDisconnect().remove((err) => console.log(err));
      }
    });

    presenceRef.on("child_added", (snap) => {
      if (snap.key !== id) {
        this.addStatusToUser(snap.key);
      }
    });

    presenceRef.on("child_removed", (snap) => {
      if (snap.key !== id) {
        this.addStatusToUser(snap.key, false);
      }
    });
  };

  addStatusToUser = (id, connected = true) => {
    let updatedUsers = this.state.users.reduce((accumulator, user) => {
      if (user.uid === id) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return accumulator.concat(user);
    }, []);
    this.setState({ users: updatedUsers });
  };

  isUserOnline = (user) => user.status === "online";

  changeChannel = (user) => {
    const channelId = this.getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name,
    };
    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
    this.setActiveChannel(user.uid);
  };

  setActiveChannel = (id) => {
    this.setState({ activeChannel: id });
  };

  getChannelId = (id) => {
    const currentUserId = this.state.user.uid;
    return id < currentUserId
      ? `${id}/${currentUserId}`
      : `${currentUserId}/${id}`;
  };

  render() {
    const { users, activeChannel } = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" /> DIRECT MESSAGES
          </span>{" "}
          ({useStore.length})
        </Menu.Item>
        {users.map((user) => (
          <Menu.Item
            key={user.uid}
            onClick={() => this.changeChannel(user)}
            style={{ opacity: 0.7, fontStyle: "italic" }}
            active={user.uid === activeChannel}
          >
            <Icon
              name="circle"
              color={this.isUserOnline(user) ? "green" : "red"}
            />
            @ {user.name}
          </Menu.Item>
        ))}
      </Menu.Menu>
    );
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(
  DirectMessages
);
