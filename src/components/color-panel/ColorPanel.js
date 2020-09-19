import React from "react";
import {
  Sidebar,
  Menu,
  Divider,
  Button,
  Modal,
  Icon,
  Label,
  Segment,
} from "semantic-ui-react";
import { SliderPicker } from "react-color";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setColors } from "../../store/actions";

class ColorPanel extends React.Component {
  state = {
    modal: false,
    primary: "",
    secondary: "",
    usersRef: firebase.database().ref("users"),
    user: this.props.currentUser,
    userColors: [],
  };

  componentDidMount() {
    const { user } = this.state;
    if (!user) return;
    this.addListener(user.uid);
  }

  componentWillUnmount() {
    this.removeListener();
  }

  removeListener = () => {
    if (!this.state.user) return;
    this.state.usersRef.child(`${this.state.user.uid}/colors`).off();
  };

  addListener = (id) => {
    const { usersRef } = this.state;
    let userColors = [];
    usersRef.child(`${id}/colors`).on("child_added", (snap) => {
      userColors.unshift(snap.val());
      this.setState({ userColors });
    });
  };

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  displayUserColors = (colors) => {
    if (!colors.length) return;
    return colors.map((color, i) => (
      <React.Fragment key={i}>
        <Divider />
        <div
          className="color__container"
          onClick={() => this.props.setColors(color.primary, color.secondary)}
        >
          <div className="color__square" style={{ background: color.primary }}>
            <div
              className="color__overlay"
              style={{ background: color.secondary }}
            ></div>
          </div>
        </div>
      </React.Fragment>
    ));
  };

  handleChangePrimary = (color) => this.setState({ primary: color.hex });

  handleChangeSecondary = (color) => this.setState({ secondary: color.hex });

  handleSaveColors = () => {
    const { primary, secondary } = this.state;
    if (!primary || !secondary) return;
    this.saveColors(primary, secondary);
  };

  saveColors = (primary, secondary) => {
    const { user, usersRef } = this.state;
    usersRef
      .child(`${user.uid}/colors`)
      .push()
      .update({ primary, secondary })
      .then(() => this.closeModal())
      .catch((err) => console.log(err));
  };

  render() {
    const { modal, primary, secondary, userColors } = this.state;
    return (
      <Sidebar
        as={Menu}
        icon="labeled"
        inverted
        vertical
        visible
        with="very thin"
        style={{ position: "static" }}
      >
        <Divider />
        <Button icon="add" size="small" color="blue" onClick={this.openModal} />
        {this.displayUserColors(userColors)}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Choose app colors</Modal.Header>
          <Modal.Content>
            <Segment inverted>
              <Label content="Primary Color" />
              <SliderPicker
                color={primary}
                onChange={this.handleChangePrimary}
              />
            </Segment>
            <Segment inverted>
              <Label content="Secondary Color" />
              <SliderPicker
                color={secondary}
                onChange={this.handleChangeSecondary}
              />
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSaveColors}>
              <Icon name="checkmark" />
              Save colors
            </Button>
            <Button color="red" inverted>
              <Icon name="remove" onClick={this.closeModal} />
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Sidebar>
    );
  }
}

export default connect(null, { setColors })(ColorPanel);
