import {FileIndexerService} from "./file-indexer.service";
import {Command} from "commander";
// Set up the commander CLI
const program = new Command();
program.name('random_line')
    .description('Retrieve a specific line from a large text file.')
    .argument('<inputFile>', 'the path of the input file')
    .argument('<lineIndex>', 'the index of the line to print')
    .action(async (inputFile: string, lineIndex: string) => {
        const index = parseInt(lineIndex, 10);
        if (isNaN(index) || index < 0) {
            console.error('Error: Line index must be a non-negative integer.');
            return;
        }
        console.log(await FileIndexerService.procesCommand(inputFile, index));
    });
program.parse(process.argv);
