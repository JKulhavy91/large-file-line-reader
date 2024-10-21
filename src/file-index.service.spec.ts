import * as fs from 'fs';
import * as path from 'path';
import { FileIndexerService, INDEX_SUFFIX, INDEX_FILE_SIZE } from './file-indexer.service';

const testDir = path.join(__dirname, 'mock');
const testFilePath = path.join(testDir, 'test_file.txt');
const testIndexDirPath = path.join(testDir, 'test_file.txt' + INDEX_SUFFIX);
const checkLineResult=async (lineToRetrieve: number) => {
    const expectedLine = `line ${lineToRetrieve}`;

    const retrievedLine = await FileIndexerService.procesCommand(testFilePath, lineToRetrieve);
    expect(retrievedLine).toBe(expectedLine);
}
describe('FileIndexerService', () => {
    beforeAll(() => {
        // Ensure test directory exists
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }

        // Write a test file with 1 million lines
        const lines = Array.from({ length: 1000000 }, (_, i) => `line ${i}`).join('\n');
        fs.writeFileSync(testFilePath, lines);
    });

    afterAll(() => {
        // Clean up test files
        fs.rmSync(testDir, { recursive: true, force: true });
    });

    describe('procesCommand', () => {
        it('should create index files and retrieve the correct line', async () => {
            await checkLineResult(5000);

            // Verify that index files were created
            const indexFiles = fs.readdirSync(testIndexDirPath);
            expect(indexFiles.length).toBe(1000);
        });

        it('should be more faster after creation of index', async () => {
            await checkLineResult(4999);
        });

        it('should return null if the input file does not exist', async () => {
            const nonExistentFilePath = path.join(testDir, 'non_existent_file.txt');
            const result = await FileIndexerService.procesCommand(nonExistentFilePath, 0);
            expect(result).toBeNull();
        });

        it('should return null if the index is out of bounds', async () => {
            const outOfBoundsIndex = 2000000; // This index is out of bounds
            const result = await FileIndexerService.procesCommand(testFilePath, outOfBoundsIndex);
            expect(result).toBeNull();
        });
    });
});
