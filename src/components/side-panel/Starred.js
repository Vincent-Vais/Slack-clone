import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../store/actions";
import firebase from "../../firebase";

class Starred extends React.Component {
  state = {
    starredChannels: [],
    activeChannel: "",
    user: this.props.currentUser,
    usersRef: firebase.database().ref("users"),
  };

  componentDidMount() {
    const { user } = this.state;
    if (!user) return;
    this.addListeners(user.uid);
  }

  componentWillUnmount() {
    if (!this.usersRef) return;
    this.usersRef.child(`${this.state.user.uid}/starred`).off();
  }

  addListeners = (id) => {
    const { usersRef, starredChannels } = this.state;
    usersRef.child(`${id}/starred`).on("child_added", (snap) => {
      const starredChannel = {
        id: snap.key,
        ...snap.val(),
      };
      this.setState({
        starredChannels: [...starredChannels, starredChannel],
      });
    });
    usersRef.child(`${id}/starred`).on("child_removed", (snap) => {
      const unstarredChannel = {
        id: snap.key,
        ...snap.val(),
      };
      const filteredChannels = starredChannels.filter(
        (channel) => channel.id !== unstarredChannel.id
      );
      this.setState({
        starredChannels: filteredChannels,
      });
    });
  };

  displayChannels = (starredChannels) => {
    if (!starredChannels.length) return null;
    return starredChannels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
      >
        # {channel.name}
      </Menu.Item>
    ));
  };

  setActiveChannel = (channel) => {
    this.setState({ activeChannel: channel.id });
  };

  changeChannel = (channel) => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
  };

  render() {
    const { starredChannels } = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="star" /> STARRED{" "}
          </span>
          ({starredChannels.length})
        </Menu.Item>
        {this.displayChannels(starredChannels)}
      </Menu.Menu>
    );
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred);
