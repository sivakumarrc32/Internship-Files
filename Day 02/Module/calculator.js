function add(a, b) {
    return a + b;
  }
  
  function sub(a, b) {
    return a - b;
  }
  
  function mul(a, b) {
    return a * b;
  }
  
  function div(a, b) {
    return b !== 0 ? a / b : "Cannot divide by 0";
  }
  
  module.exports = {
    add,
    sub,
    mul,
    div,
  };
  