import React from "react";

export interface RankProps {
  side: number;
}

const Rank: React.FC<RankProps> = (props) => {
  const { side } = props;

  /**
   * Get the rank labels for the chess board
   * @param {number} side Rank direction (left or right)
   * @returns {Array<React.ReactElement>} Array of Rank divs
   */

  const getRanks = (side: number) => {
    const ranks = [];
    for (let index = 8; index >= 1; index--) {
      ranks.push(
        <div className="ranks" key={`rank${side}_${index}`}>
          {index}
        </div>
      );
    }
    return ranks;
  };

  return <div className="rank-list">{getRanks(side)}</div>;
};

export default Rank;
