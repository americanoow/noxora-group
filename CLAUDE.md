@AGENTS.md

# Claude Code

Instruções compartilhadas estão em `AGENTS.md`; este arquivo guarda só o que é específico do Claude Code.

- Skills do projeto: `.claude/skills/` (cópias das skills de `.agents/skills`; origem em `skills-lock.json`).
- MCP do projeto: `.mcp.json` (Context7 e Chrome DevTools MCP). O Claude Code pede aprovação na primeira vez que um servidor de projeto é usado.
- Plugins do projeto: `.claude/settings.json` habilita Ponytail e Caveman (o Claude pede confiança nos marketplaces em sessão nova). O hook do RTK vive em `~/.claude/settings.json`, fora do repositório.
