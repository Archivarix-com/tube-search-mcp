# tube-search-mcp

MCP server for [Archivarix Tube Search](https://tube.archivarix.net) — search archived YouTube videos via AI assistants.

Search over 1 billion YouTube videos indexed since 2005. Find deleted videos, metadata, thumbnails, and subtitles.

## Quick Start

```bash
npx tube-search-mcp --api-key tsk_YOUR_KEY
```

Or with environment variable:

```bash
export TUBE_API_KEY=tsk_YOUR_KEY
npx tube-search-mcp
```

Get your API key at [tube.archivarix.net](https://tube.archivarix.net) (Profile → API Keys).

## Configuration

### Claude Desktop

Add to `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "tube-search": {
      "command": "npx",
      "args": ["-y", "tube-search-mcp"],
      "env": {
        "TUBE_API_KEY": "tsk_YOUR_KEY"
      }
    }
  }
}
```

### Claude Code

Add to `~/.claude/mcp.json`:

```json
{
  "mcpServers": {
    "tube-search": {
      "command": "npx",
      "args": ["-y", "tube-search-mcp"],
      "env": {
        "TUBE_API_KEY": "tsk_YOUR_KEY"
      }
    }
  }
}
```

### VS Code

Add to `.vscode/mcp.json` in your project:

```json
{
  "servers": {
    "tube-search": {
      "command": "npx",
      "args": ["-y", "tube-search-mcp"],
      "env": {
        "TUBE_API_KEY": "tsk_YOUR_KEY"
      }
    }
  }
}
```

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "tube-search": {
      "command": "npx",
      "args": ["-y", "tube-search-mcp"],
      "env": {
        "TUBE_API_KEY": "tsk_YOUR_KEY"
      }
    }
  }
}
```

## Available Tools

| Tool | Description |
|------|-------------|
| `search_channel` | Find all archived videos from a YouTube channel |
| `search_videos` | Full-text search across video titles and descriptions |
| `get_video` | Get metadata for a specific video by ID |
| `get_subtitles` | Get transcript as readable plain text |
| `get_summary` | Get AI-generated video summary |
| `generate_summary` | Generate a new AI summary for a video |
| `browse_summaries` | Browse summaries by tag, channel, or language |
| `get_video_status_history` | View status change history of a video |
| `get_usage` | Check your current API usage and limits |

## Resources

| URI | Description |
|-----|-------------|
| `tube://video/{videoId}` | Video metadata |
| `tube://channel/{channelId}` | Channel info |
| `tube://subtitles/{videoId}` | Transcript as plain text |
| `tube://summary/{videoId}` | AI-generated summary |
| `tube://tags` | Popular summary tags |

## Prompts

| Prompt | Description |
|--------|-------------|
| `research_video` | Comprehensive video analysis workflow |
| `channel_overview` | Channel research and statistics |
| `find_deleted` | Discover and analyze deleted videos |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TUBE_API_KEY` | API key (required) | — |
| `TUBE_MCP_URL` | Custom MCP endpoint | `https://tube.archivarix.net/mcp` |

## How It Works

This package acts as a stdio-to-HTTP proxy. It connects to the remote Archivarix Tube Search MCP server via Streamable HTTP and exposes the same tools, resources, and prompts over stdio transport for local AI clients.

```
AI Client ←(stdio)→ tube-search-mcp ←(HTTP)→ tube.archivarix.net/mcp
```

## Documentation

Full documentation: [tube.archivarix.net/guide/mcp](https://tube.archivarix.net/guide/mcp)

## License

MIT
