import React from "react";
import { Progress } from "semantic-ui-react";

const ProgressBar = ({ upload, percent }) =>
  upload && (
    <Progress
      className="progress__bar"
      percent={percent}
      size="medium"
      inverted
      progress
      indicating
    />
  );

export default ProgressBar;
