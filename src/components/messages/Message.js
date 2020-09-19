import React from "react";
import { Comment, Image } from "semantic-ui-react";
import moment from "moment";

const Message = ({ user, message }) => {
  const isOwnMessage = (message, user) =>
    message.user.id === user.uid ? "message__self" : "";

  const timeFromNow = (time) => moment(time).fromNow();

  const isImage = () =>
    message.hasOwnProperty("image") && !message.hasOwnProperty("content");

  return (
    <Comment>
      <Comment.Avatar src={message.user.avatar} />
      <Comment.Content className={isOwnMessage(message, user)}>
        <Comment.Author as="a">{message.user.name}</Comment.Author>
        <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
        {isImage() ? (
          <Image src={message.image} className="message__image" />
        ) : (
          <Comment.Text>{message.content}</Comment.Text>
        )}
      </Comment.Content>
    </Comment>
  );
};

export default Message;
