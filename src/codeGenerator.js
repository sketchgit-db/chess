const GenerateCode = (length) => {
  var result = [];
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    result.push(chars[Math.floor(Math.random() * chars.length)]);
  }
  return result.join('');
}

export default GenerateCode;