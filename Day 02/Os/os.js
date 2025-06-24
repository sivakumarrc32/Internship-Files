const os = require('os');

console.log('Operating System: ', os.platform());
console.log("User Info: ", os.userInfo());

const CurrentOs ={
    type: os.type(),
    release: os.release(),
    totalmemory: os.totalmem(),
    freememory: os.freemem(),
}

console.log('Current Operating System: ', CurrentOs);