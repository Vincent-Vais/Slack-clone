import React from "react";
import { Menu } from "semantic-ui-react";

import UserPanel from "./UserPanel";
import Channels from "./Channel";
import DirectMessages from "./DirectMessages";
import Starred from "./Starred";

class SidePanel extends React.Component {
  render() {
    const {
      currentUser,
      currentChannel,
      onChannelChange,
      primaryColor,
    } = this.props;
    return (
      <Menu
        size="large"
        inverted
        vertical
        style={{
          backgroundColor: primaryColor,
          fontSize: "1.2rem",
          position: "static",
          height: "100%",
        }}
      >
        <UserPanel primaryColor={primaryColor} />
        <Starred currentUser={currentUser} />
        <Channels
          currentChannel={currentChannel}
          currentUser={currentUser}
          onChannelChange={onChannelChange}
        />
        <DirectMessages currentUser={currentUser} />
      </Menu>
    );
  }
}

export default SidePanel;
