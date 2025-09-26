# Anagram solver

Simple anagram solver, separated into frontend and backend components, and built with docker

## How to run

```bash
    docker compose up --build
```

After the build finishes, navigate to (http://localhost:8080)[localhost].

## Testing

You can run tests by navigating to the backend folder, and running

```bash
  bun test
```

PSA: If you don't have bun installed, follow the install instruction (https://bun.com/docs/installation)[here]
TODO: This should be automated for first time setup.

## Simple improvements, which I didn't have time to do

1. CI/CD pipeline
  1. Automatic deployment
  2. Run tests before every PR
2. Only show "No anagrams found for input" text after first click
3. Styling framework
4. Bun test as a build step. Simply don't have the necessary experience to decide whether it should be a separate step, or part of the build process.
  Currently my intuition leads me to it being separate, as we don't want local builds to fail on test fails - it would only make debugging harder.
