import React from "react";

import { Header, Segment, Input, Icon } from "semantic-ui-react";

class MessagesHeader extends React.Component {
  render() {
    const {
      channelName,
      users,
      handleSearchChange,
      searchLoading,
      privateChannel,
      handleStar,
      isChannelStarred,
    } = this.props;
    return (
      <Segment clearing>
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            {channelName}
            {!privateChannel && (
              <Icon
                name={isChannelStarred ? "star" : "star outline"}
                color={isChannelStarred ? "yellow" : "black"}
                onClick={handleStar}
              />
            )}
          </span>
          <Header.Subheader>{users}</Header.Subheader>
        </Header>
        <Header floated="right">
          <Input
            onChange={handleSearchChange}
            size="mini"
            name="searchTerm"
            icon="search"
            placeholder="Search Messages"
            loading={searchLoading}
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;
