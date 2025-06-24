//Creating Object 
console.log("\t Object Created ");
const person = {
    name: "John",
    age: 30,
    city: "New York"
};
console.log(person);
console.log("\n");

//Accessing Object Properties
console.log("\t Accessing Object Properties ");
console.log("Name :",person.name);
console.log("Age :",person.age);
console.log("City :",person.city);
console.log("\n");

//Updating Object Properties
console.log("\t Updating Object Properties ");
person.name = "Jane";
console.log(person);
console.log("\n");

//Adding New Properties
console.log("\t Adding New Properties ");
person.gender = "Female";
console.log(person);
console.log("\n");

//Adding New Object in Person Object
console.log("\t Adding New Object in Person Object ");
person.address = {
    street: "123 Main St",
    city: "New York",
    state: "NY"
};
console.log(person);
console.log("\n");

//Deleting Properties
console.log("\t Deleting Properties ");
delete person.address.state;
console.log(person);
console.log("\n");

//Checking for Property
console.log("\t Checking for Property ");
console.log("State exists:", "address.state" in person);
console.log("Gender exists:", "gender" in person);