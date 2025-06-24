// //Reading and Writing Files Using Synchronous Methods

// console.log("\t Reading and Writing Files Using Synchronous Methods");

// const {readFileSync, writeFileSync } = require('fs');
// const path = require('path');

// const dirPath = __dirname

// //Reading first file content
// const first = readFileSync(path.join(dirPath,'syncContent','file.txt'), 'utf8');

// console.log('First file content:', first);

// //Creating second file content

// const second = writeFileSync(path.join(dirPath,'syncContent','file2.txt'), 'This is the second file content');

// console.log('Second file created successfully');

// //Reading second file content

// const readSecondFile = readFileSync(path.join(dirPath,'syncContent','file2.txt'), 'utf8');

// console.log('Second file content:', readSecondFile);

// //Updating first file content

// const editFristFile = writeFileSync(path.join(dirPath,'syncContent','file.txt'), 'This is the updated first file content');

// console.log('First file updated successfully');

// console.log("\n");

//-------------------------------------------------------------------------------------------------------------------------------------------------

//Reading and Writing Files Using Asynchronous Methods
console.log("\t Reading and Writing Files Using Asynchronous Methods");

const {readFile, writeFile } = require('fs');
const path = require('path');

const dirPath = path.join(__dirname,'asyncContent');

//Reading first file content
readFile(path.join(dirPath,'file1.txt'), 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading first file:', err);
        return;
    }
    const result1 =  data;
    console.log('First file content:',result1);
    //Reading second file content
    readFile(path.join(dirPath,'file2.txt'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading first file:', err);
            return;
        }
        const result2 = data;
        console.log('Second file content:', result1);
        //Creating Third file content using first and second file content
        writeFile(path.join(dirPath,'file3.txt'), `Here is a Thrid File : \n First File Content: ${result1}\nSecond File Content: ${result2}`, (err,data) => {
            if (err) {
                console.error('Error writing third file:', err);
                return;
            }
            const result3 = data;
            console.log('Third file content:', result3);
        });

    });
});

