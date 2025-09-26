import { expect, test, describe } from "bun:test";
// NOTE: Lookup how to have absolute imports in JS.
import { reverse_index, get_anagrams } from "src/index";

describe("Reverse index", () => {
  test("maps words to themselves", () => {
    const words = ["abc"];

    const expected = new Map<string, Array<string>>(
      Object.entries({ abc: ["abc"] }),
    );

    const actual = reverse_index(words);

    expect(actual).toEqual(expected);
  });

  test("creates an empty map for empty inputs", () => {
    const words = [];

    const expected = new Map<string, Array<string>>();
    const actual = reverse_index(words);

    expect(actual).toEqual(expected);
  });

  test("deduplicates entries", () => {
    const words = ["aaa", "aaa"];
    const expected = new Map<string, Array<string>>(
      Object.entries({ aaa: ["aaa"] }),
    );

    const actual = reverse_index(words);

    expect(actual).toEqual(expected);
  });
});

describe("Anagram fetcher", () => {
  const dummy_index = new Map<string, Array<string>>(
    Object.entries({ abc: ["abc", "bac", "cba"] }),
  );
  test("returns all anagrams for a given entry", () => {
    expect(get_anagrams("abc", dummy_index)).toEqual(["abc", "bac", "cba"]);
  });

  test("returns an empty array for invalid words", () =>
    expect(get_anagrams("xxx", dummy_index)).toEqual([]));
});
