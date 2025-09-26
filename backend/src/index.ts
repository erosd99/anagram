type AnagramInput = {
  word: string;
};
/**
 * Initializes a reverse index. This means which sorted words correspond to which set of input words.
 * @param raw_anagrams: The input dataset.
 * @returns reverse index: The mappings containing <sorted word>: [<input word>] pairs.
 */
function reverse_index(
  raw_anagrams: Array<string>,
): Map<string, Array<string>> {
  const anagrams = new Map<string, Array<string>>();

  for (let i = 0; i < raw_anagrams.length; i++) {
    // TODO: Can we operate on byte streams instead of words?
    const word = raw_anagrams[i];
    const sorted = raw_anagrams[i].split("").sort().join("");
    if (anagrams.has(sorted)) {
      const is_duplicate = anagrams.get(sorted)!.includes(word);
      if (!is_duplicate) {
        anagrams.get(sorted)!.push(word);
      }
    } else {
      anagrams.set(sorted, [word]);
    }
  }

  return anagrams;
}

// NOTE: Not too happy about global constants, but a database would be a giant global constant anyways...
const ANAGRAMS = await Bun.file("artifacts/szavak.txt")
  .text()
  .then((x) => x.split("\n"))
  .then((x) => reverse_index(x));

/**
 * Extracts the anagrams corresponding to an input word from our reverse index.
 * @param word: The word, for whose anagrams we're looking for.
 * @param anagram_map: Dependency Injected anagram map for easier testing.
 * @returns anagrams: The anagrams of the input word.
 */
function get_anagrams(
  word: string,
  anagram_map: Map<string, Array<string>>,
): Array<string> {
  return anagram_map.get(word.split("").sort().join("")) ?? [];
}

const CORSHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const _ = Bun.serve({
  port: 3000,
  routes: {
    "/anagram": {
      OPTIONS: () =>
        new Response(null, {
          status: 204,
          headers: CORSHeaders,
        }),
      POST: async (req) => {
        const raw_req = await req.json();

        // TODO: In a realistic scenario, we'd use a validation lib here, like zod.
        if (
          !raw_req ||
          typeof raw_req !== "object" ||
          !("word" in raw_req) ||
          typeof raw_req.word !== "string"
        ) {
          return Response.json(
            {
              error:
                'Invalid input: Expected an object with a "word" key containing a string',
            },
            { status: 400, headers: CORSHeaders },
          );
        }

        const parsed_req: AnagramInput = raw_req as AnagramInput;
        if (parsed_req.word.length != 5) {
          return Response.json(
            { error: "Invalid input: the input must be 5 characters long" },
            { status: 400, headers: CORSHeaders },
          );
        }

        const res = get_anagrams(parsed_req.word, ANAGRAMS);
        return Response.json(
          res.map((x) => ({ name: x })),
          {
            status: 200,
            headers: CORSHeaders,
          },
        );
      },
    },
    "/*": Response.json({ message: "Not found", status: 404 }),
  },
});

export { reverse_index, get_anagrams };
