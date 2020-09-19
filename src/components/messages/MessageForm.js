import React from "react";
import firebase from "../../firebase";
import { Segment, Button, Input } from "semantic-ui-react";
import uuidv4 from "uuid/v4";
import FileModal from "./FileModal";
import ProgressBar from "./ProgressBar";

class MessageForm extends React.Component {
  state = {
    messagesRef: this.props.messagesRef,
    message: "",
    loading: false,
    error: "",
    modal: false,
    uploadState: "",
    uploadTask: null,
    storageRef: firebase.storage().ref(),
    percentUploaded: 0,
  };

  componentWillUnmount() {
    if (this.state.uploadTask !== null) {
      this.state.uploadTask.cancel();
      this.setState({ uploadTask: null });
    }
  }

  handleChange = (event) =>
    this.setState({ message: event.target.value, error: "" });

  sendMessage = () => {
    const { currentChannel } = this.props;
    const { message, messagesRef } = this.state;
    if (!message.length) return this.setState({ error: "Add a message" });
    this.setState({ loading: true });
    const ref = this.props.getMessagesRef();
    ref
      .child(currentChannel.id)
      .push()
      .set(this.createMessage())
      .then(() =>
        this.setState({
          loading: false,
          message: "",
          error: "",
          uploadState: "",
          percentUploaded: 0,
        })
      )
      .catch((err) => this.setState({ loading: false, error: err.message }));
  };

  createMessage = (fileUrl = null) => {
    const {
      currentUser: { uid, displayName, photoURL },
    } = this.props;

    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: uid,
        name: displayName,
        avatar: photoURL,
      },
    };

    if (fileUrl) message.image = fileUrl;
    else message.content = this.state.message;
    return message;
  };

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  getPath = () => {
    if (this.props.privateChannel) {
      return `chat/private-${this.props.currentChannel.id}`;
    } else {
      return `chat/public`;
    }
  };

  uploadFile = (file, meta) => {
    const { currentChannel } = this.props;
    const pathToUpload = currentChannel.id;
    const ref = this.props.getMessagesRef();
    const filePath = `${this.getPath()}/${uuidv4()}.jpg`;

    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, meta),
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          (snap) => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            console.log(percentUploaded);
            this.setState({ percentUploaded });
          },
          (err) => {
            console.log(err);
            this.setState({
              error: err.message,
              uploadState: err.message,
              uploadTask: null,
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then((url) => {
                this.sendFileMessage(url, ref, pathToUpload);
              })
              .catch((err) => {
                console.log(err);
                this.setState({
                  error: err.message,
                  uploadState: err.message,
                  uploadTask: null,
                });
              });
          }
        );
      }
    );
  };

  sendFileMessage = (url, ref, path) => {
    ref
      .child(path)
      .push()
      .set(this.createMessage(url))
      .then(() => {
        this.setState({ uploadState: "", percentUploaded: 0 });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error: err.message });
      });
  };

  render() {
    const {
      message,
      error,
      loading,
      modal,
      uploadState,
      percentUploaded,
    } = this.state;
    return (
      <Segment className="message__form">
        <Input
          fluid
          name="message"
          label={<Button icon={"add"} />}
          labelPosition="left"
          style={{ marginBottom: "0.7em" }}
          value={message}
          onChange={this.handleChange}
          className={error.includes("message") ? "error" : ""}
          placeholder="Write your message"
        />
        <Button.Group icon widths={2}>
          <Button
            onClick={this.sendMessage}
            color="orange"
            content="Add reply"
            icon="edit"
            labelPosition="left"
            disabled={loading}
          />
          <Button
            color="teal"
            content="Add media"
            icon="cloud upload"
            labelPosition="right"
            disabled={uploadState === "uploading"}
            onClick={this.openModal}
          />
        </Button.Group>
        <FileModal
          modal={modal}
          closeModal={this.closeModal}
          uploadFile={this.uploadFile}
        />
        <ProgressBar upload={uploadState} percent={percentUploaded} />
      </Segment>
    );
  }
}

export default MessageForm;
