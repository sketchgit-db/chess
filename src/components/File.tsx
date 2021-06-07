import React from "react";

export interface FileProps {
  side: number;
}

const File: React.FC<FileProps> = (props) => {
  const { side } = props;

  /**
   * Get the file labels for the chess board
   * @param {number} side File direction (top or bottom)
   * @returns {Array<React.ReactElement>} Array of File divs
   */

  const getFiles = (side: number) => {
    const files = [];
    for (let index = 97; index <= 104; index++) {
      files.push(
        <div className="files" key={`file${side}_${index - 97}`}>
          {String.fromCharCode(index)}
        </div>
      );
    }
    return files;
  };

  return (
    <div className="file-list">{getFiles(side)}</div>
  )
};

export default File;