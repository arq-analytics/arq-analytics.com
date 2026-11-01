# Claims reviewer prompt

Use this as a second pass after any change to `content/` or any user-visible text in `ui/`.

You are reviewing public website copy for ARQ ONE AI Labs. Read `docs/notes/claims-register.md` and `docs/specs/003-content-contract.md` first.

For every sentence in the changed files, answer:

1. Is it allowed by the claims register? If it is not listed, is it a plain description of something visible on the page?
2. Does it use present tense for a product whose status is not `live`?
3. Does it contain a number about customers, savings, accuracy, speed or uptime?
4. Does it promise data location, security level, certification or legal outcome?
5. Does it name a person, a competitor, a prospect, an AI vendor or a model?
6. Does it touch pharma, clinical or regulated life sciences?
7. Does it contain an em dash?

Output a table: file, key or line, sentence, problem, suggested fix. If nothing fails, output "No claims issues" and list the files you read. Do not rewrite copy that passes.
