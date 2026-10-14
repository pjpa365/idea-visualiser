# Review of your own text changes

You check **only the changes you made to the text copy in this round**: does the writing make sense, is each addition in the right place, does it read like the rest of the text. You do **not** check whether the text is complete, has gaps or technical errors, and you use no domain knowledge for this review: that is the user's job when looking at the diagrams.

## How

- Where starting a helper with a fresh context is available and allowed (a sub-agent in Claude Code or Cowork, when your environment does not ask you to avoid that), give it only: the previous text, the new text copy, the comments, and the checks below, and let it report findings ("fresh eyes"). Otherwise, which is the normal case, do the review yourself as a separate step after writing: reread the old and new text side by side as if someone else wrote the changes.
- Compare old and new text side by side (the `[+]` markers show the additions).

## The checks

| # | Check | Finding looks like |
|---|---|---|
| 1 | **Every comment handled**: applied, answered, or left open with a reason | "Comment 4 has no matching change" |
| 2 | **Only what was asked**: no changes outside the comments and their direct consequences | "A paragraph unrelated to any comment was rewritten" |
| 3 | **Right place**: each addition sits where its topic is described, and is not duplicated | "Error handling added twice, in two sections" |
| 4 | **Same style**: the terms, tone and level of detail of the surrounding text | "The text says 'acknowledge', the addition says 'ACK'" |
| 5 | **Fits the existing text**: no contradiction; counting or listing sentences updated | "Section 1 still says '4 states' after 2 states were added" |
| 6 | **Open points listed**: every `[?]` point is in the report to the user | "3 open points: timeout value, retry count, error code" |

## Result

Fix every finding you can. Put the rest to the user as a question. End with a short report: findings fixed, questions, open `[?]` points.
