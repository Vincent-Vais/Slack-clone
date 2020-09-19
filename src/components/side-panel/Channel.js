import React from "react";

import {
  Menu,
  Icon,
  Modal,
  Form,
  Input,
  Button,
  Message,
  Label,
} from "semantic-ui-react";

import firebase from "../../firebase";

class Channels extends React.Component {
  state = {
    channels: [],
    modal: false,
    channelName: "",
    channelDetails: "",
    error: "",
    channelsRef: firebase.database().ref("channels"),
    messagesRef: firebase.database().ref("messages"),
    activeChannel: null,
    channel: null,
    notifications: [],
  };

  componentDidMount() {
    this.addListeners()
      .then((channel) => this.changeChannel(channel))
      .catch(() => console.log("no channels"));
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners = () => {
    return new Promise((resolve, reject) => {
      const { channelsRef } = this.state;
      let loadedChannels = [];
      channelsRef.on("child_added", (snap) => {
        loadedChannels.push(snap.val());
        this.setState(
          { channels: loadedChannels },
          () => {
            if (this.state.channels.length) resolve(this.state.channels[0]);
            else reject();
          },
          () => this.addNotificationListener(snap.key)
        );
      });
    });
  };

  removeListeners = () => {
    const { channelsRef } = this.state;
    channelsRef.off();
    this.state.channels.forEach((channel) =>
      this.state.messagesRef.child(channel.id).off()
    );
  };

  addNotificationListener = (channelId) => {
    this.state.messagesRef.child(channelId).on("value", (snap) => {
      if (this.state.channel) {
        this.handleNotifications(
          channelId,
          this.state.channel.id,
          this.state.notifications,
          snap
        );
      }
    });
  };

  handleNotifications = (channelId, currentChannelId, notifications, snap) => {
    let lastTotal = 0;

    let index = notifications.findIndex(
      (notification) => notification.id === channelId
    );

    if (index === -1) {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0,
      });
    } else {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;

        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }

      notifications[index].lastKnownTotal = snap.numChildren();
    }

    this.setState({
      notifications,
    });
  };

  closeModal = () =>
    this.setState({
      modal: false,
      channelName: "",
      channelDetails: "",
      error: "",
    });
  openModal = () => this.setState({ modal: true });

  formIsValid = () =>
    this.state.channelName.length && this.state.channelDetails.length;

  emptyInputs = () =>
    this.setState({ channelName: "", channelDetails: "", error: "" });
  handleChange = (event) =>
    this.setState({ [event.target.name]: event.target.value });

  handleSubmit = (event) => {
    event.preventDefault();
    if (!this.formIsValid())
      return this.setState({ error: "Please fill in name and about fields" });
    this.addChannel();
  };

  addChannel = () => {
    const { channelsRef, channelName, channelDetails } = this.state;
    const {
      currentUser: { displayName, photoURL },
    } = this.props;
    const key = channelsRef.push().key;
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: displayName,
        avatar: photoURL,
      },
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => this.closeModal())
      .catch((err) => this.setState({ error: err.message }));
  };

  displayChannels = (channels) => {
    if (!channels.length) return null;
    return channels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        {this.getNotificationCount(channel) && (
          <Label color="red">{this.getNotificationCount(channel)}</Label>
        )}
        # {channel.name}
      </Menu.Item>
    ));
  };

  changeChannel = (channel) => {
    const { onChannelChange } = this.props;
    this.setActiveChannel(channel);
    this.clearNotifications();
    onChannelChange(channel);
    this.setState({ channel });
  };

  clearNotifications = () => {
    let index = this.state.notifications.findIndex(
      (notification) => notification.id === this.state.channel.id
    );

    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].total = this.state.notifications[
        index
      ].lastKnownTotal;
      updatedNotifications[index].count = 0;
      this.setState({ notifications: updatedNotifications });
    }
  };

  getNotificationCount = (channel) => {
    let count = 0;

    this.state.notifications.forEach((notification) => {
      if (notification.id === channel.id) {
        count += notification.count;
      }
    });

    if (count > 0) return count;
  };

  setActiveChannel = (channel) => {
    this.setState({ activeChannel: channel.id });
  };

  render() {
    const { channels, modal, channelName, channelDetails, error } = this.state;
    return (
      <React.Fragment>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS{" "}
            </span>
            ({channels.length}) <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {this.displayChannels(channels)}
        </Menu.Menu>
        <Modal basic open={modal} onClose={this.closeModal} closeIcon>
          {error && (
            <Message warning header="Invalid input" content={error}></Message>
          )}
          <Modal.Header>Add a chanel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  value={channelName}
                  onChange={this.handleChange}
                  required
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  label="About the Channel"
                  name="channelDetails"
                  value={channelDetails}
                  onChange={this.handleChange}
                  required
                />
              </Form.Field>
            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" /> Add
            </Button>
            <Button color="red" inverted onClick={this.emptyInputs}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Channels;
