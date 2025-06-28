import fs from 'fs';
import path from 'path';

/**
 * Loads skill embeddings from a JSON file.
 * The file is expected to be located at 'src/ai/skillEmbeddings.json'.
 *
 * @returns {Object} The parsed JSON object containing skill embeddings.
 * @throws {Error} If the file does not exist or cannot be read.
 */
export const loadEmbeddings = (): object => {
    const filePath = path.resolve(__dirname, '../../../../ai/skillEmbeddings.json');

    if (!fs.existsSync(filePath)) {
        throw new Error(`Embeddings file not found at ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');

    return JSON.parse(fileContent);
}