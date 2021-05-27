/**
 * Generates a random gameCode when a new game is created
 * @param {number} length The length of the gameCode
 * @returns {string} The gameCode
 */

const GenerateCode = (length: number): string => {
  var result = [];
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    result.push(chars[Math.floor(Math.random() * chars.length)]);
  }
  return result.join('');
}

export default GenerateCode;