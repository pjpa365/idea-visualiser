# Idea Visualizer: the `visualize-idea` skill

Turns a specification, idea or any text into Mermaid diagrams. You look at the diagrams in the Idea Visualizer viewer, click on what is wrong or missing and write a comment, and Claude uses your comments to improve the text. Repeat until the text is right.

The skill never changes your own text: changes go into a copy, with `[+]` before each addition of the latest round and `[?]` before each open point for you to answer.

## What you need

- A paid Claude plan (Pro, Max, Team or Enterprise) to add plugins in the Claude apps. Claude Code works with any Claude Code login.
- **Chrome** (or Edge) for the viewer.
- **Node.js** (only in Claude Code and the Code tab of Claude Desktop): the skill uses it to check every diagram before you see it. Without Node.js the skill still works, but the diagrams are not machine-checked.

## Install: pick the AI tool you use

### 1. Claude Code (terminal, VS Code, JetBrains) and the Code tab of Claude Desktop

This is **full mode**: the skill reads your files, writes the diagrams into a folder, and opens the viewer on your PC.

1. In Claude Code, type:
   ```
   /plugin marketplace add pjpa365/idea-visualiser
   /plugin install visualize-idea@idea-visualiser
   ```
2. Restart Claude Code.
3. Updates: `/plugin marketplace update idea-visualiser`, then `/plugin update visualize-idea@idea-visualiser`. Or turn on automatic updates for this marketplace in the `/plugin` menu (Marketplaces).

Already added the plugin on claude.ai or Claude Desktop (section 2) with the same Claude account? Then it is already in Claude Code at the next start (synced plugins); skip the steps above.

### 2. claude.ai (web) and the Chat tab of Claude Desktop

This is **limited mode**: Claude cannot reach a folder on your PC, so you get the diagrams as downloads and use the online viewer.

1. Open **Customize** in the left sidebar, then the **Plugins** tab.
2. Click **Add**, then **Add marketplace**, then **Add from a repository**, and enter `pjpa365/idea-visualiser`.
3. Open the **Discover** tab, select **visualize-idea** and click **Add**.

The plugin is saved to your Claude account, so it is also available in Claude Desktop and (synced) in Claude Code.

### 3. Claude mobile app

Add the plugin once on claude.ai or Claude Desktop (section 2). It belongs to your account, so the skill is then also available on your phone, in limited mode. *(Not yet tested on mobile.)*

### 4. Other AI coding tools (Cursor, Codex, Gemini CLI and others), or Claude Code without plugins

The `skills` tool from [skills.sh](https://skills.sh) copies the skill folder into the tool's skills folder:

```
npx skills add pjpa365/idea-visualiser
```

- Add `-g` to install it for all your projects instead of only the current one, and `-a claude-code` (or `-a cursor`, `-a codex`, …) to choose the tool.
- Updates: `npx skills update`.
- The skill is written and tested for Claude. Other tools that read `SKILL.md` skills should be able to follow it. *(Not yet tested in other tools.)*

### 5. Only the viewer

To look at Mermaid files (`.mmd`) without the skill: open **https://pjpa365.github.io/idea-visualiser/** in Chrome, or download `index.html` from this repository and open it. Choose **Open folder** and pick the folder with your `.mmd` files.

- The main address always has the newest viewer. Every version also stays online in its own folder (`…/idea-visualiser/v1/`, `…/v2/`, …). The skill always points you to the version it was built with.
- In Claude Code the skill uses its own copy of the viewer, so you need no internet for it.

## Use

1. Ask Claude: *"Visualize specs/my-spec.md"* (or paste the text). Claude proposes one or two diagram types, or uses the ones you ask for.
2. Open the viewer (Claude tells you where), choose **Open folder** and pick the diagram folder. In limited mode: open the online viewer address Claude gives you and pick the downloaded `.mmd` files.
3. Click an element to comment on it, press **Save**, then tell Claude: *"Process my comments"*. In limited mode: attach the saved `UserComments-Mermaid.md` to the chat.
4. Repeat until the text is right, then say: *"The text is final"*. Claude lists any open points left and writes a final copy without markers. You copy that text into your original yourself.

Optional files (templates are in the skill's `templates` folder; ask Claude for one):

- `visualize-project.md` in the project folder: folders, versioning, project background, terms, diagram preferences.
- `<input-name>-directives.md` next to the input text: how to read and draw that one text.

Defaults: the diagrams go to a folder `diagrams` next to the input text; versioning is off.

## License

MIT, see `LICENSE`. The viewer and the check script include open-source parts, unchanged and each under its own license. The main one is Mermaid (MIT); the ELK layout (elkjs) is under the Eclipse Public License 2.0, with its source code at https://github.com/kieler/elkjs. The full list with all license texts is in `THIRD-PARTY-NOTICES.md`, and the same notices are at the end of `index.html` and of the check script.

## What is in this repository

- `index.html`: the newest viewer (the GitHub Pages main address); `v1/`, `v2/`, …: every viewer version.
- `plugins/visualize-idea/`: the plugin with the skill, its scripts and its own copy of the viewer.
- `.claude-plugin/marketplace.json`: makes this repository a plugin marketplace.