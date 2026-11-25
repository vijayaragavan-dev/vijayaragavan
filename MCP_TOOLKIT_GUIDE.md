# MCP Toolkit Guide

Global Model Context Protocol setup for OpenCode 2.4.1 on Windows.

- **Config:** `C:\Users\User\.config\opencode-v2\opencode\opencode.jsonc`
- **Agents:** `C:\Users\User\.config\opencode-v2\opencode\agents\`
- **Commands:** `C:\Users\User\.config\opencode-v2\opencode\commands\`
- **Launch with:** `C:\Users\User\.local\bin\opencode-v2.cmd` (plain `opencode` is V1.18.33)

Everything is configured **globally**. No `opencode.json` is written into a project, so the
portfolio repository stays free of tooling config.

---

## 1. Status at a glance

| Server | Type | Domain | Tools | Status | Auth | Cost |
|---|---|---|---|---|---|---|
| context7 | remote | Library docs | 2 | CONNECTED / VERIFIED | none | Free tier |
| playwright | local | Browser automation | 25 | CONNECTED / VERIFIED | none | Free |
| chrome-devtools | local | Browser diagnostics | 33 | CONNECTED | none | Free |
| figma | remote | Design | 50 | CONNECTED / VERIFIED | OAuth (done) | Free seat |
| shadcn | local | UI components | 7 | CONNECTED / VERIFIED | none | Free |
| clawdcursor | local | Desktop control | 6 | CONNECTED | none | Local |
| serena | local | Code intelligence | 23 | CONNECTED / VERIFIED | none | Free |
| gitnexus | local | Repo/API graph | 17 | CONNECTED | none | Local |
| agentmemory | local | Persistent memory | 7 | CONNECTED | none | Local |
| semgrep | local | SAST | 7 | CONNECTED / VERIFIED | none | Free |
| trivy | local | SCA / secrets / IaC | 6 | CONNECTED / VERIFIED | none | Free |
| dbhub | local | SQL databases | 2 | CONNECTED / VERIFIED | none (demo DB) | Free |
| chroma | local | Vector store | 13 | CONNECTED / VERIFIED | none | Free |
| huggingface | remote | Models / datasets | 4 | CONNECTED | anonymous | Free (rate-limited) |
| fetch | local | Web page retrieval | 1 | CONNECTED / VERIFIED | none | Free |
| aws-docs | local | AWS documentation | 5 | CONNECTED / VERIFIED | none | Free |
| github | remote | Repos / PRs / issues | 47 | CONNECTED / VERIFIED | OAuth via gh | Free |

**All 17 enabled and connected, 255 tools exposed.** `github` is authenticated through the
GitHub CLI device flow (see §7).

`pending` in `mcp list` is not an error: those servers start lazily on the first tool call.
`connected` means the handshake and tool catalog already succeeded.

---

## 2. Health check

```powershell
& "C:\Users\User\.local\bin\opencode-v2.cmd" mcp list
& "C:\Users\User\.local\bin\opencode-v2.cmd" reload
```

Or use the slash command `/mcp-health`, which routes to the `devops-engineer` subagent and
returns a table plus a diagnosis for anything not connected.

A healthy run ends with every server `connected`. `pending` means the server has not been
called yet and will start on first use; it is not a failure.

---

## 3. Domains

### Frontend and design
- **context7** — current, version-specific docs for React, Next.js, Tailwind, and most
  libraries. Prefer it over memory for API details.
- **shadcn** — registry components and install commands. Registry search needs a
  `components.json` in the project; the portfolio does not have one.
- **figma** — read designs, generate code from frames, write designs back. Authenticated.
- **playwright** — deterministic browser flows, form fills, screenshots, assertions.
- **chrome-devtools** — console, network, performance traces, Lighthouse, DOM inspection.
  Launched headless with telemetry disabled.

### Code intelligence
- **serena** — symbol-level navigation, references, safe renames, project memories.
  Uses the classic tool interface (not the REPL), so there is no arbitrary code execution.
- **gitnexus** — repository graph, route/handler impact analysis, generated maps.
- **agentmemory** — durable notes and lessons across sessions, with an audit trail.

### Security and quality
- **semgrep** — static analysis over source. Metrics reporting disabled
  (`SEMGREP_SEND_METRICS=off`).
- **trivy** — dependency CVEs, secrets, misconfiguration, licences.
- **playwright / chrome-devtools** — functional, accessibility, and performance checks.

### Data and AI
- **dbhub** — schema inspection and SQL. Currently pointed at the bundled `--demo` SQLite
  database because no production DSN was provided.
- **chroma** — persistent local vector store at
  `C:\Users\User\.local\share\opencode-v2\data\chroma`.
- **huggingface** — model and dataset discovery, model cards. Anonymous, rate-limited.
- **fetch** — fetch a URL and convert it to Markdown.

### Platform and desktop
- **aws-docs** — public AWS documentation search and reading. Documentation only; it has no
  AWS credentials and cannot change infrastructure.
- **clawdcursor** — drive Windows applications and the desktop when a task needs a GUI.
- **github** — repositories, issues, pull requests, code search, reviews. Authenticated as
  `vijayaragavan-dev` through the `gh` device flow.

---

## 4. Agents

Twelve domain agents live in the global `agents/` directory. Each has a focused system
prompt and least-privilege MCP access: unrelated servers are denied per agent.

| Agent | Mode | Use it for |
|---|---|---|
| `fullstack-engineer` | all | End-to-end features, UI + API + data + tests |
| `frontend-specialist` | subagent | React/Next UI, responsive layout, a11y, performance |
| `backend-engineer` | subagent | APIs, validation, auth, persistence |
| `ui-ux-designer` | subagent | Design systems, Figma-to-spec handoff |
| `ai-ml-engineer` | subagent | Datasets, training, evaluation, inference cost |
| `genai-agent-engineer` | subagent | Agent design, tool schemas, prompts, guardrails |
| `rag-specialist` | subagent | Chunking, embeddings, retrieval evaluation |
| `database-engineer` | subagent | Schema review, safe SQL, migrations (writes require approval) |
| `cybersecurity-analyst` | subagent | Local SAST/SCA review; read-only, cannot edit |
| `devops-engineer` | subagent | CI/CD, containers, IaC; deploys require approval |
| `qa-testing-engineer` | subagent | Functional, accessibility, visual, performance tests |
| `research-documentation` | subagent | Cited technical writing; Markdown only |

Deliberate restrictions:
- `cybersecurity-analyst` and `research-documentation` cannot edit source.
- `research-documentation` cannot run shell commands.
- `ui-ux-designer` cannot run shell commands or touch application logic.
- `database-engineer` must ask before executing SQL.
- `devops-engineer` must ask before `terraform apply`, `kubectl apply`, `docker push`, or
  any billable AWS create/delete call, and is denied `terraform destroy`.

Use one explicitly:

```powershell
opencode-v2 run --agent database-engineer "List the tables in the demo database"
```

---

## 5. Commands

| Command | Delegates to | Purpose |
|---|---|---|
| `/mcp-health` | devops-engineer | Status table plus fixes; never edits config |
| `/security-review` | cybersecurity-analyst | Semgrep + Trivy review of the project |
| `/ui-audit` | frontend-specialist | Console, responsive, a11y, Lighthouse audit |

Commands accept arguments, e.g. `/security-review src/app/api`.

---

## 6. Permission model

42 global rules in `opencode.jsonc`:

- `shell *` → **ask**. Read-only commands are pre-approved: `git status/diff/log/show`,
  `ls`, `dir`, `rg`, typecheck, lint, build, tests, `docker ps`, `docker compose config`.
- Destructive commands are **denied**: force-push, `reset --hard`, `rm -rf`,
  `Remove-Item -Recurse`, Docker prune, `kubectl delete`, `terraform destroy`, `dropdb`,
  `DROP DATABASE`, `shutdown`.
- Reads of `**/.ssh/**`, `*.pem`, `*.key`, `.aws/credentials` are **denied**; `.env` reads
  **ask**.
- `external_directory` → **ask**, so nothing outside the workspace is touched silently.

Agents add their own narrower rules on top. Deny wins over allow.

---

## 7. Manual steps

### GitHub — done, here is how it works
The server is authenticated as `vijayaragavan-dev` with the scopes `repo`, `read:org`,
`read:user`, `gist` and `workflow`. It exposes 47 tools; `get_me` and `list_branches` were
verified against the live API.

GitHub's authorization server publishes no `registration_endpoint`, so OpenCode's built-in
OAuth (which needs dynamic client registration) cannot complete. The working path is the
official GitHub CLI device flow:

```powershell
gh auth login --hostname github.com --git-protocol https --web `
  --scopes "repo,read:org,gist,workflow,read:user"
# approve the one-time code at https://github.com/login/device

# hand the token to OpenCode without writing it into opencode.jsonc
$tok = (gh auth token).Trim()
[Environment]::SetEnvironmentVariable("GITHUB_PERSONAL_ACCESS_TOKEN", $tok, "User")
opencode-v2 service set env GITHUB_PERSONAL_ACCESS_TOKEN $tok
opencode-v2 service restart
```

`service set env` matters: the background service keeps the environment it was started
with, so a user-level variable alone is not visible until the service is restarted. The
service config makes it survive later restarts too.

To rotate or revoke: `gh auth logout --hostname github.com`, then repeat the login. The
token is never written to `opencode.jsonc` or to this repository.

### Hugging Face (optional)
Set `HF_TOKEN` in the environment for higher rate limits. Anonymous access works today.

### Real database (optional)
Replace the `dbhub` command's `--demo` flag with a connection string, for example
`--dsn "postgres://user:pass@host:5432/db"`. Keep credentials in an environment variable,
not in `opencode.jsonc`.

### Serena (optional)
Serena has not been activated on this repository, so no `.serena/` directory was created.
Activate it per project when you want symbol-level indexing:

```
serena_activate_project("C:\Users\User\OneDrive\Desktop\portfolio3d")
```

---

## 8. Configuration notes and known fixes

- **Service environment.** A variable added with `setx` is not visible to an already-running
  background service. Use `opencode-v2 service set env NAME VALUE` plus
  `opencode-v2 service restart`, or the MCP header resolves to an empty string and the
  server returns `400 Authorization header is badly formatted`.
- **GitHub auth.** No dynamic client registration on GitHub's side, so `opencode-v2 mcp auth
  github` reports "not an OAuth-capable remote server". Use the `gh` device flow above.
- **Protocol pinning.** `fetch`, `serena`, and `aws-docs` advertise the `2026-07-28` MCP
  revision and reject the legacy `initialize` handshake. `auto` negotiation did not fall
  back for them, so each sets `"protocol": "2026-07-28"`. Other servers use the default.
  If one of these fails after an upgrade with a protocol message, try `"legacy"`.
- **Chroma / pydantic.** `chroma-mcp` resolves `pydantic 2.12`, which breaks it. The command
  pins `--with pydantic<2.12`.
- **npx argument handling.** PowerShell's `npx` shim mangles arguments. Packages whose bin
  name differs from the package name need the explicit form used in the config:
  `npx -y -p chrome-devtools-mcp@latest chrome-devtools-mcp`.
- **Semgrep isolation.** Semgrep is installed with `uv tool`, not globally, because a global
  install upgraded `starlette` and broke FastAPI. Binary:
  `C:\Users\User\.local\share\bin\semgrep.exe`.
- **Chrome DevTools telemetry.** Launched with `--no-usage-statistics` and
  `--no-performance-crux` to avoid sending usage data or CrUX queries.
- **Timeouts.** `mcp.timeout.startup = 90000`, `catalog = 60000`, sized for `uvx` cold
  starts on Windows.
- **Tool output.** Capped at 1500 lines / 65536 bytes to keep large scans from flooding
  context.
- **Watcher.** Ignores `node_modules`, `.next`, `.git`, `dist`, `coverage`, `.playwright-mcp`.

---

## 9. Maintenance

```powershell
# back up before editing
Copy-Item "$env:USERPROFILE\.config\opencode-v2\opencode\opencode.jsonc" `
  "$env:USERPROFILE\.config\opencode-v2\opencode\opencode.jsonc.backup-$(Get-Date -f yyyyMMdd-HHmmss)"

# validate, reload, verify
Get-Content "$env:USERPROFILE\.config\opencode-v2\opencode\opencode.jsonc" -Raw | ConvertFrom-Json
opencode-v2 reload
opencode-v2 mcp list
```

Backups kept in the config directory:

| File | Size | Contents |
|---|---|---|
| `opencode.jsonc.backup-20261125-125809` | 428 B | Original 3-server config |
| `opencode.jsonc.backup-20261125-141311` | 1145 B | 7-server config before the expansion |
| `opencode.jsonc.backup-20261125-190108` | 6470 B | 17-server config before protocol pinning |
| `opencode.jsonc.backup-20261125-192620` | 6470 B | Before enabling the GitHub server |

When adding a server, prefer one that fills a gap. Duplicates deliberately avoided:
Puppeteer (Playwright), DuckDuckGo (built-in web search), Qdrant/Pinecone (Chroma),
AWS API (docs-only), Postman/Atlassian/Slack (credentials, no local need).
