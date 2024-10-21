# Large File Line Reader

A TypeScript program that efficiently reads an arbitrary line from a large text file using indexing. This tool is optimized to handle files with up to 1 billion lines, where each line can be up to 1000 characters in length.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Example](#example)
- [Tests](#tests)

## Installation

1. Install the dependencies:
   ```
   npm install
   ```
## Usage
To retrieve a specific line from a large text file, run the following command:
  ```
    npm start -- input_file.txt 2
  ```

- `<inputFile>`: Path to the input text file.
- `<lineIndex>`: The index of the line you want to print (0-based).
- 
## Example
Prepare a sample input file named input_file.txt:

Run the command to get a specific line:

```
   npm start -- input_file.txt 2
```

## Tests

Tests are written in jest

Run tests

```
   npm test
```
