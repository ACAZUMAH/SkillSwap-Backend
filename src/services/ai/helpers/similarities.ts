
/**
 * Calculates the cosine similarity between two vectors.
 * Cosine similarity is a measure of similarity between two non-zero vectors
 * @param vecA - The first vector.
 * @param vecB - The second vector.
 * @returns {number} The cosine similarity between the two vectors, ranging from -1 to 1.
 */
export const calculateCosineSimilarity = (vecA: number[], vecB: number[]): number => {
    const dotProduct = vecA.reduce((sum, value, index) => sum + value * vecB[index], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, value) => sum + value * value, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, value) => sum + value * value, 0));

    if (magnitudeA === 0 || magnitudeB === 0) return 0; // Avoid division by zero

    return dotProduct / (magnitudeA * magnitudeB);
}