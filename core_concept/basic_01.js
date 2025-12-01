const fs = require('fs/promises')

async function readFile() {
    try {
        const data = await fs.readFile('example.txt', 'utf8')
        console.log(data)
    } catch (err) {
        console.log(err)
    }
}

async function createFile() {
    try {
        await fs.writeFile('example.txt', 'this how i doing my works');
    } catch (err) {
        console.log(err)
    }
}
function main() {
    Promise.all([createFile(), readFile()])
    console.log(1);
    console.log(2);
    console.log(3);
}

main()