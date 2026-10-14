# Finish: the text is final

1. Take the latest text copy (full mode: from the record file; limited mode: from this chat).
2. List the open points: `node <skill>/scripts/markers.mjs list <latest-copy>`.
   - Open points left: show them and ask the user to answer them (in the chat or by editing the copy). Do not write a final copy yet.
3. No open points left: `node <skill>/scripts/markers.mjs final <latest-copy> <text-folder>/<name>_text_final.md`. It writes the text without any marker. Record it in the record file (full mode); offer it as a download (limited mode).
4. Tell the user where the final copy is, and that taking it over into the original document is their step: you never change the original.
5. If comments caused by the skill itself came up in this project and are not yet in the learning notes, add them now (`knowledge/files.md`).
