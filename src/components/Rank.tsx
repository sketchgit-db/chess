import React from "react";

export interface RankProps {
  side: number /** The side on which the ranks are displayed, left or right */;
}

/**
 * Returns the list of ranks, 1 to 8, displayed on the board
 * @param {RankProps} props The props passed by the Board component
 * @returns {React.ReactElement} React component
 */

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
