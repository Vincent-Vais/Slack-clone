import React from "react";
import firebase from "../../firebase";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";
import { setUserPosts } from "../../store/actions";
import { connect } from "react-redux";
import { Segment, Comment } from "semantic-ui-react";

class Messages extends React.Component {
  state = {
    messages: [],
    numUniqueUsers: "",
    searchTerm: "",
    searchLoading: false,
    searchResults: [],
    privateChannel: this.props.isPrivate,
    privateMessagesRef: firebase.database().ref("privateMessages"),
    usersRef: firebase.database().ref("users"),
    isChannelStarred: false,
    listeners: [],
  };

  componentDidMount() {
    const { currentChannel, currentUser } = this.props;
    const { listeners } = this.state;
    if (!currentUser || !currentChannel) return;
    this.removeListeners(listeners);
    this.addListeners(currentChannel.id);
    this.addUserStarredListener(currentChannel.id, currentUser.uid);
  }

  componentWillUnmount() {
    this.removeListeners(this.state.listeners);
  }

  removeListeners = (listeners) => {
    this.state.listeners.forEach((listener) => {
      listener.ref.child(listener.id).off(listener.event);
    });
  };

  addToListeners = (id, ref, event) => {
    const index = this.state.listeners.findIndex(
      (listener) =>
        listener.id === id && listener.ref === ref && listener.event === event
    );
    if (index === -1) {
      const listener = {
        id,
        ref,
        event,
      };
      this.setState({ listeners: [...this.state.listeners, listener] });
    }
  };

  addListeners = (channelId) => {
    this.addMessageListener(channelId);
  };

  addUserStarredListener = (channelId, userId) => {
    this.state.usersRef
      .child(`${userId}/starred`)
      .once("value")
      .then((data) => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channelId);
          this.setState({ isChannelStarred: prevStarred });
        }
      });
  };

  addMessageListener = (id) => {
    const { messagesRef } = this.props;
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    ref.child(id).on("child_added", (snap) => {
      loadedMessages.push(snap.val());
      this.setState({ messages: [...loadedMessages] });
      this.countUniqueUsers(loadedMessages);
      this.countUserPosts(loadedMessages);
    });
    this.addToListeners(id, ref, "child_added");
  };

  countUniqueUsers = (messages) => {
    const numUniqueUsers = messages.reduce((accumulator, currentMessage) => {
      const {
        user: { id },
      } = currentMessage;
      if (!accumulator.includes(id)) accumulator.push(id);
      return accumulator;
    }, []).length;
    const displayString =
      numUniqueUsers > 1 ? `${numUniqueUsers} users` : `${numUniqueUsers} user`;
    this.setState({ numUniqueUsers: displayString });
  };

  countUserPosts = (messages) => {
    let userPosts = messages.reduce((accumulator, { user }) => {
      if (user.name in accumulator) {
        accumulator[user.name].count += 1;
      } else {
        accumulator[user.name] = {
          avatar: user.avatar,
          count: 1,
        };
      }
      return accumulator;
    }, {});

    this.props.setUserPosts(userPosts);
  };

  displayMessages = (messages) => {
    const { currentUser } = this.props;
    if (!messages || !messages.length) return null;
    return messages.map((message) => (
      <Message key={message.timestamp} user={currentUser} message={message} />
    ));
  };

  displayChannelName = (channel) =>
    channel ? `${this.state.privateChannel ? "@" : "#"}${channel.name}` : "";

  handleSearchChange = (event) => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true,
      },
      () => {
        this.handleSearchMessages();
      }
    );
  };

  handleSearchMessages = () => {
    const { searchTerm, messages } = this.state;
    const channelMessages = [...messages];
    const regex = new RegExp(searchTerm, "gi");
    const searchResults = channelMessages.filter(
      (message) =>
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
    );
    this.setState({
      searchResults,
    });
    setTimeout(() => this.setState({ searchLoading: false }), 1000);
  };

  getMessagesRef = () => {
    const { messagesRef } = this.props;
    const { privateMessagesRef, privateChannel } = this.state;
    if (privateChannel) return privateMessagesRef;
    return messagesRef;
  };

  handleStar = () => {
    this.setState(
      (prevState) => ({
        isChannelStarred: !prevState.isChannelStarred,
      }),
      () => this.starChannel()
    );
  };

  starChannel = () => {
    if (this.state.isChannelStarred) {
      this.state.usersRef
        .child(`${this.props.currentUser.uid}/starred`)
        .update({
          [this.props.currentChannel.id]: {
            name: this.props.currentChannel.name,
            details: this.props.currentChannel.details,
            createdBy: {
              name: this.props.currentChannel.createdBy.name,
              avatar: this.props.currentChannel.createdBy.avatar,
            },
          },
        });
    } else {
      this.state.usersRef
        .child(`${this.props.currentUser.uid}/starred`)
        .child(this.props.currentChannel.id)
        .remove((err) => console.log(err));
    }
  };

  render() {
    const { currentChannel, currentUser, messagesRef } = this.props;
    const {
      numUniqueUsers,
      messages,
      searchResults,
      searchTerm,
      searchLoading,
      privateChannel,
      isChannelStarred,
    } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(currentChannel)}
          users={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          privateChannel={privateChannel}
          handleStar={this.handleStar}
          isChannelStarred={isChannelStarred}
        />
        <Segment>
          <Comment.Group className="messages">
            {searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>
        <MessageForm
          currentChannel={currentChannel}
          currentUser={currentUser}
          messagesRef={messagesRef}
          privateChannel={privateChannel}
          getMessagesRef={this.getMessagesRef}
        />
      </React.Fragment>
    );
  }
}

export default connect(null, { setUserPosts })(Messages);
