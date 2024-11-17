// searchUtils.ts

export interface SearchOptions<T> {
  threshold?: number;
  searchFields?: (keyof T)[];
  matchMode?: "any" | "all"; // 'any' matches if any word matches, 'all' requires all words to match
}

export interface Searchable {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Normalizes text by converting to lowercase and removing diacritics
 */
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

/**
 * Splits text into words and normalizes each word
 */
export const normalizeAndSplitWords = (text: string): string[] => {
  return text
    .split(/\s+/)
    .map((word) => normalizeText(word))
    .filter((word) => word.length > 0);
};

/**
 * Calculates the similarity between two strings using Levenshtein distance
 */
export const calculateSimilarity = (str1: string, str2: string): number => {
  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= str1.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str2.length; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return (
    1 - matrix[str1.length][str2.length] / Math.max(str1.length, str2.length)
  );
};

/**
 * Checks if a word matches any word in the target text
 */
const wordMatchesTarget = (
  searchWord: string,
  targetWords: string[],
  threshold: number
): boolean => {
  return targetWords.some((targetWord) => {
    // Check for exact match after normalization
    if (targetWord.includes(searchWord)) {
      return true;
    }
    // Check for similarity
    return calculateSimilarity(targetWord, searchWord) >= threshold;
  });
};

/**
 * Searches through items using fuzzy matching and diacritic normalization
 * Supports multi-word search terms
 */
export const searchItems = <T extends Searchable>(
  items: T[],
  searchTerm: string,
  options: SearchOptions<T> = {}
): T[] => {
  const {
    threshold = 0.7,
    searchFields = Object.keys(items[0] || {}) as (keyof T)[],
    matchMode = "all",
  } = options;

  // Split and normalize search terms
  const searchWords = normalizeAndSplitWords(searchTerm);

  // If no search words, return all items
  if (searchWords.length === 0) {
    return items;
  }

  return items.filter((item) => {
    return searchFields.some((field) => {
      const fieldValue = item[field];

      // Skip if field value is not a string
      if (typeof fieldValue !== "string") {
        return false;
      }

      // Split and normalize field value
      const fieldWords = normalizeAndSplitWords(fieldValue);

      if (matchMode === "all") {
        // All search words must match at least one field word
        return searchWords.every((searchWord) =>
          wordMatchesTarget(searchWord, fieldWords, threshold)
        );
      } else {
        // At least one search word must match
        return searchWords.some((searchWord) =>
          wordMatchesTarget(searchWord, fieldWords, threshold)
        );
      }
    });
  });
};
