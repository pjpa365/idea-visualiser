# Idea Visualizer: the `visualize-idea` skill

**See your text, then improve it by commenting on the picture.** For visual thinkers, who spot a missing step, a dead end or an unclear hand-over faster in a diagram than in pages of text.

It works as a loop:

1. **Text → diagrams.** Claude turns your specification, idea, process or plan into Mermaid diagrams (flowchart, swimlane, sequence, state, ER, class, packet, XY chart). Every element traces back to a sentence in your text; anything Claude had to assume is marked with ❓.
2. **Diagrams → comments.** You open the diagrams in the Idea Visualizer viewer and click any box, line or message to comment on it: "this is missing", "what happens after a timeout?", "this should be a final state".
3. **Comments → better text *and* better diagrams.** Claude places each comment at the right spot in the text, writes the change into a copy of your text in its own style, and draws new diagrams from that improved text.
4. Repeat until the text is right, then say *"the text is final"*.

So your comments improve not only the drawing but the **input text itself**. Your original is never changed: changes go into a copy, with `[+]` before each addition of the latest round and `[?]` before each open point for you to answer.

**Built-in domain knowledge.** The skill has domain packs that help it draw each field in its own terms: embedded software, network protocols, system architecture, business processes, business software, user interfaces, planning, and a general pack for anything else. The skill only visualizes: it never judges whether your text is complete; you see that in the diagrams. More packs, and extension skills that build on this one, can be added later.

**It learns, and you can improve it yourself.** While processing your comments, the skill notes which comments were caused by its own drawing (not by gaps in your text) in a learning-notes file in your home folder (`visualize-idea/learning-notes.md`). A second skill in the same plugin, `visualize-idea-improve`, turns those notes into better drawing rules in your own copy of this repository, tests the new version against the old one automatically, and saves it after your "yes". You can offer good improvements back to this repository. See [Improve the skill](#improve-the-skill-claude-code-only).

**Stays up to date.** In Claude Code the skill checks once a day whether a newer version exists, and tells you what to do.

## What you need

- A paid Claude plan (Pro, Max, Team or Enterprise) to add plugins in the Claude apps. Claude Code works with any Claude Code login.
- **Chrome** (or Edge) for the viewer.
- **Node.js** (only in Claude Code and the Code tab of Claude Desktop): before you see a diagram, the skill reads it with the same Mermaid version as the viewer and checks its own rules, so you get no diagram that fails to load. Without Node.js the skill still works, but the diagrams are not checked first.

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
npx skills add pjpa365/idea-visualiser --skill visualize-idea
```

- `--skill visualize-idea` takes only the work loop; the improvement loop works only in Claude Code with the plugin (see [Improve the skill](#improve-the-skill-claude-code-only)).
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

## Steer the result: project file and directives file

Without any extra file the skill works with sensible defaults. Two optional plain-text files let you steer it, so you don't have to repeat the same wishes in every request, and every round of the loop is drawn the same way.

| | Project file | Directives file |
|---|---|---|
| **Name and place** | `visualize-project.md` in your project folder | `<text-name>-directives.md` next to the text, e.g. `door-controller-directives.md` for `door-controller.md` |
| **Applies to** | every text in the project | one text |
| **Holds** | project background, domain packs to use, terms and naming, diagram preferences (size, direction, types to prefer or avoid), folders, versioning, whether to show a plan before the text is changed, local change or full redraw | the name for the diagrams, which diagram types, scope (what to draw and what to leave out), level of detail, colour roles or fixed colours, domain, and any project setting you want different for this text |
| **Advantage** | Claude knows the context and your words, so diagrams use your terms and fit the project | each text is drawn exactly as you want, the same in every round |

- **Priority**: directives file > project file > defaults. When they contradict each other or the text, Claude asks.
- **Format**: plain text with headings; free wording is fine. Fill in only what you need and delete the rest. Ask Claude *"give me the project file template"* or *"give me the directives template"* to start.
- **Never changed**: like your text, these files are only read, never changed by the skill.

**How to use them when calling the skill**

- Full mode (Claude Code): just put them in their place. *"Visualize specs/door-controller.md"* finds `visualize-project.md` in the project folder and `specs/door-controller-directives.md` by itself.
- Another name or place: say so, e.g. *"Visualize specs/door-controller.md with directives notes/door-rules.md and project file docs/project.md"*.
- Limited mode (claude.ai, Desktop chat, mobile): attach the files to the chat together with the text.
- Quick one-off wishes can also go in the request itself: *"Visualize specs/door-controller.md as a state diagram only, overview level"*.

Defaults without these files: the diagrams go to a folder `diagrams` next to the input text; versioning is off; Claude shows its plan before it changes the text; after a round of comments only the changed parts of a diagram are redrawn (tick **Redraw completely** in the viewer for a full redraw).

## Examples

The `examples` folder shows what the skill works with and what it makes:

- `examples/diagrams/`: one diagram per type, with colour roles. Open the folder in the viewer to look around.
- `examples/cases/`: four complete examples (a door controller, a purchase approval, a sensor protocol, and a round of comments on the door controller), each with its text, project file and directives file. Copy one `project` folder somewhere and ask Claude to visualize its text. These cases are also the test set of the improvement loop.

## Improve the skill (Claude Code only)

Improving the skill needs **Claude Code** (terminal, IDE, or the Code tab of Claude Desktop), with git and Node.js, and a free GitHub account. It does not work in claude.ai, the Chat tab of Claude Desktop or the mobile app; those keep using the version you installed.

1. **Make your own copy of this repository**, once:
   - **Fork** (public): on GitHub, press **Fork** at the top of this page. Simplest; offering your improvements back is one click.
   - **Private copy**: on GitHub, create a new, empty **private** repository (**+** → **New repository** → **Private**, nothing else). Claude fills it with this repository in the next step. (GitHub has no private forks.)
2. In Claude Code, ask: *"Set up my copy of the visualize-idea skill"*. Claude asks which repository and which folder on your computer, and links your copy to this original.
3. **Install the plugin from your copy** instead of this repository: `/plugin marketplace add <your-name>/<your-repository>`, then `/plugin install visualize-idea@idea-visualiser`. (Remove the original first with `/plugin marketplace remove idea-visualiser` if you added it.)
4. Use the skill as usual. When notes have collected, ask: *"Improve the visualize-idea skill"*. Claude turns your learning notes into general rules, tests old against new on the examples, and asks you once: *"Save as version …?"*. On "yes" it saves to your copy; then update the plugin (`/plugin marketplace update`, `/plugin update visualize-idea`).
5. Optional: ask *"Propose my improvements to the original"*. You get a link to a pull request; the owner of this repository reviews it, and when it is accepted everyone gets it.

## Your own copy: getting the latest version

Your fork or private copy was copied **once** from this repository. It does not follow new versions by itself.

- **Automatic hint**: in Claude Code, the skill checks once a day and tells you when this original has changes your copy does not have yet, or when your installed plugin is older than your copy.
- **Update**: ask Claude *"Update my copy from the original"*. It brings the new changes into your copy (when you and the original changed the same lines, Claude merges them and asks if unsure) and saves your copy. Then update the installed plugin: `/plugin marketplace update`, `/plugin update visualize-idea`, and restart Claude Code.
- **By hand** (in your copy's folder): `git fetch upstream`, `git merge upstream/main`, `git push`. A public fork can also use **Sync fork** on its GitHub page.

## License

MIT, see `LICENSE`. The open-source libraries used are listed in `THIRD-PARTY-NOTICES.md`; the full license texts are at the end of the viewer (`index.html`) and of the check script.

## What is in this repository

- `index.html`: the newest viewer (the GitHub Pages main address); `v1/`, `v2/`, …: every viewer version.
- `plugins/visualize-idea/`: the plugin, with two skills: `visualize-idea` (the work loop, with its scripts and its own copy of the viewer) and `visualize-idea-improve` (the improvement loop). Its change log is `plugins/visualize-idea/CHANGELOG.md`.
- `examples/`: example diagrams and the example cases (also the improvement loop's test set).
- `.claude-plugin/marketplace.json`: makes this repository a plugin marketplace.

The viewer and the check script are built from program code kept in a separate developer repository; changes to the skills' text, the examples and this README are made here.