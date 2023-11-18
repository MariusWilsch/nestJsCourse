const fs = require('fs');
const path = require('path');

// Retrieve command line arguments
const args = process.argv.slice(2);
const targetDirectory = args[0]; // First argument: Target directory
const className = args[1]; // Second argument: Class name
const fileName = args[2] || className.toLowerCase(); // Third argument: File name

const dtoDirectory = path.join(__dirname, targetDirectory, 'dto');

const dtoFileContent = `import { IsEmail, IsOptional, IsString } from 'class-validator';

export class ${className} {
\t// Add your fields here
}
`;

const indexFileContent = `export * from './${fileName}.dto';`;

// Create directory if it doesn't exist
if (!fs.existsSync(dtoDirectory)) {
	fs.mkdirSync(dtoDirectory, { recursive: true });
}

// Create or overwrite files
fs.writeFileSync(path.join(dtoDirectory, `${fileName}.dto.ts`), dtoFileContent);
fs.writeFileSync(path.join(dtoDirectory, 'index.ts'), indexFileContent);

console.log('DTO files generated successfully in', dtoDirectory);
