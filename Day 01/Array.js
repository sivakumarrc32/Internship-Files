//Creating Array with Objects
console.log("\t Array Created with Objects");
const array = [{"Name" : "Siva","Age" : 21},{"Name" : "Sabari", "Age" : 18}];
console.log(array);
console.log("\n");

//Array Length
console.log("\t Finding Array Length");
console.log("Array Length: ", array.length);
console.log("\n");

//Array Indexing
console.log("\t Accessing Array Elements");
console.log("First Element: ", array[0]);
console.log("Second Element: ", array[1]);

console.log("\n");

//Array Methods
console.log("\t Array Methods");

console.log("Push New Element");
console.log("Before:",array);
array.push({"Name" : "Chandra Prakash" , "Age" : 57});
console.log("After:",array);

console.log("Pop Element");
console.log("Before:",array);
const poppedElement = array.pop();
console.log("After:",array);

console.log("Shift Element");
console.log("Before:",array);
const shiftedElement = array.shift();
console.log("After:",array);

console.log("Unshift Element");
console.log("Before:",array);
const unshiftedElement = array.unshift({"Name" : "Chandra Prakash" , "Age" : 57});
console.log("After:",array);
console.log("\n");

console.log("\t Array with Map Function");
const modifiedArray = array.map((element) =>{
    return {"Name" : element.Name, "Age" : element.Age + 1};
});
console.log("Modified Array:", modifiedArray);
console.log("\n");

console.log("\t Array with Filter Function");
const filterElement = array.filter((element) => {
    return element.Age > 20;
});
console.log("Filtered Array:", filterElement);
console.log("\n");

console.log("\t Array with Find Function");
const findElement = array.find((element) => {
    return element.Name === "Sabari";
});
console.log("Found Element:", findElement);
