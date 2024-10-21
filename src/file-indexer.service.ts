import * as fs from 'fs';
import * as path from 'path';

export const INDEX_SUFFIX = '.index';
const MAX_LINE_LENGTH = 1000;
export const INDEX_FILE_SIZE = 1000; // Number of indexes per file
const ENCODING = 'utf-8';

export class FileIndexerService {
    static async procesCommand(inputFilePath: string, lineIndex: number): Promise<string | null> {
        try {
            if (!fs.existsSync(inputFilePath)) {
                console.log('Input file not found.');
                return null;
            }

            const indexDirPath = path.join(path.dirname(inputFilePath), path.basename(inputFilePath) + INDEX_SUFFIX);

            // Create index files if they don't exist
            if (!fs.existsSync(indexDirPath)) {
                console.log('Index directory not found. Creating index files...');
                await FileIndexerService.createIndexFiles(inputFilePath, indexDirPath);
            }

            return await FileIndexerService.getLineByIndex(inputFilePath, indexDirPath, lineIndex);
        } catch (error) {
            console.error('Error in procesCommand:', error);
            return null;
        }
    }


    private static async createIndexFiles(inputFilePath: string, indexDirPath: string): Promise<void> {
        try {
            const fileStream = fs.createReadStream(inputFilePath, {encoding: ENCODING});
            fs.mkdirSync(indexDirPath, {recursive: true});

            let lineStartPosition = 0;
            let fileCount = 0;
            let indexCount = 0;

            // Create the first index file
            let currentIndexFileStream = fs.createWriteStream(path.join(indexDirPath, `index_${fileCount}${INDEX_SUFFIX}`), {encoding: ENCODING});

            const rl = require('readline').createInterface({
                input: fileStream,
                crlfDelay: Infinity // Recognizes all instances of CR LF as a single line break
            });

            for await (const line of rl) {
                // If the current index file reaches 1000 lines, move to the next file
                if (indexCount === INDEX_FILE_SIZE) {
                    currentIndexFileStream.close();
                    fileCount++;
                    currentIndexFileStream = fs.createWriteStream(path.join(indexDirPath, `index_${fileCount}${INDEX_SUFFIX}`), {encoding: ENCODING});
                    indexCount = 0;
                }
                // Write the starting position of the line to the index file

                currentIndexFileStream.write(lineStartPosition.toString() +'\n');

                lineStartPosition += line.length + 1; // +1 for the newline character
                indexCount++;

            }

            // Close the last index file if it's open
            if (indexCount > 0) {
                currentIndexFileStream.close();
            }
        } catch (error) {
            console.error('Error creating index files:', error);
        }
    }

    private static async getLineByIndex(inputFilePath: string, indexDirPath: string, lineIndex: number): Promise<string | null> {
        try {
            const fileIndex = Math.floor(lineIndex / INDEX_FILE_SIZE); // Determine the index file number
            const indexWithinFile = lineIndex % INDEX_FILE_SIZE; // Determine the index within that file

            const indexFilePath = path.join(indexDirPath, `index_${fileIndex}${INDEX_SUFFIX}`);
            if (!fs.existsSync(indexFilePath)) {
                console.log('Line does not exists');
                return null;
            }
            const indexFile = await fs.promises.readFile(indexFilePath, ENCODING);
            const indexLines = indexFile.split('\n');

            // Validate index range
            if (indexWithinFile >= indexLines.length) {
                console.error('Index out of bounds:', lineIndex);
                return null;
            }

            const startPos = parseInt(indexLines[indexWithinFile], 10);
            const endPos = indexWithinFile + 1 < indexLines.length ? parseInt(indexLines[indexWithinFile + 1], 10) : undefined;

            const fileDescriptor = await fs.promises.open(inputFilePath, 'r');
            const bufferSize = (endPos ? endPos - startPos : MAX_LINE_LENGTH);
            const buffer = Buffer.alloc(bufferSize);

            await fileDescriptor.read(buffer, 0, bufferSize, startPos);
            await fileDescriptor.close();

            return buffer.toString(ENCODING).split('\n')[0]; // Strip out the newline character
        } catch (error) {
            console.error('Error reading line by index:', error);
            return null;
        }
    }
}
