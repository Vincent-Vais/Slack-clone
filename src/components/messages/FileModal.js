import React from "react";
import mime from "mime-types";
import { Modal, Input, Button, Icon } from "semantic-ui-react";

class FileModal extends React.Component {
  state = {
    file: null,
    authorized: ["image/jpeg", "image/png"],
    error: "",
  };
  addFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    this.setState({ file });
  };
  sendFile = () => {
    const { file } = this.state;
    const { uploadFile } = this.props;
    if (!file) return this.setState({ error: "Please provide a file" });
    if (!this.isAuthorized(file.name))
      return this.setState({ error: "Type is not supported" });
    const metadata = { contentType: mime.lookup(file.name) };
    uploadFile(file, metadata);
    this.close();
  };

  isAuthorized = (fileName) =>
    this.state.authorized.includes(mime.lookup(fileName));

  close = () => {
    const { closeModal } = this.props;
    this.deleteInput();
    closeModal();
  };

  deleteInput = () => {
    this.setState({
      file: null,
      authorized: ["image/jpeg", "image/png"],
      error: "",
    });
  };

  render() {
    const { modal } = this.props;
    return (
      <Modal basic open={modal} onClose={this.close}>
        <Modal.Header>Select an image file</Modal.Header>
        <Modal.Content>
          <Input
            fluid
            label="File"
            name="file"
            type="file"
            onChange={this.addFile}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button inverted color="green" onClick={this.sendFile}>
            <Icon name="checkmark" /> Send
          </Button>
          <Button inverted color="red" onClick={this.close}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FileModal;
