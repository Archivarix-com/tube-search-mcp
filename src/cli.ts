#!/usr/bin/env node

import { startProxy } from './proxy.js';

const DEFAULT_URL = 'https://tube.archivarix.net/mcp';

function parseArgs(): { apiKey: string; mcpUrl: string } {
  const args = process.argv.slice(2);
  let apiKey = process.env.TUBE_API_KEY;
  let mcpUrl = process.env.TUBE_MCP_URL || DEFAULT_URL;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--api-key' && args[i + 1]) {
      apiKey = args[++i];
    } else if (args[i] === '--url' && args[i + 1]) {
      mcpUrl = args[++i];
    } else if (args[i] === '--help' || args[i] === '-h') {
      printHelp();
      process.exit(0);
    } else if (args[i] === '--version' || args[i] === '-v') {
      console.error('tube-search-mcp v1.0.0');
      process.exit(0);
    }
  }

  if (!apiKey) {
    console.error(
      'Error: API key is required.\n' +
        'Set TUBE_API_KEY environment variable or use --api-key flag.\n' +
        'Get your API key at https://tube.archivarix.net/guide/mcp/auth',
    );
    process.exit(1);
  }

  return { apiKey, mcpUrl };
}

function printHelp(): void {
  console.error(
    `tube-search-mcp - MCP server for Archivarix Tube Search

Search archived YouTube videos (1B+ indexed since 2005) via AI assistants.
Find deleted videos, metadata, thumbnails, and subtitles.

Usage:
  npx tube-search-mcp --api-key tsk_...
  TUBE_API_KEY=tsk_... npx tube-search-mcp

Options:
  --api-key <key>  API key (or set TUBE_API_KEY env var)
  --url <url>      Custom MCP endpoint (default: ${DEFAULT_URL})
  --help, -h       Show this help
  --version, -v    Show version

Claude Desktop (~/.claude/claude_desktop_config.json):
  {
    "mcpServers": {
      "tube-search": {
        "command": "npx",
        "args": ["-y", "tube-search-mcp"],
        "env": { "TUBE_API_KEY": "tsk_..." }
      }
    }
  }

VS Code (.vscode/mcp.json):
  {
    "servers": {
      "tube-search": {
        "command": "npx",
        "args": ["-y", "tube-search-mcp"],
        "env": { "TUBE_API_KEY": "tsk_..." }
      }
    }
  }

Cursor (~/.cursor/mcp.json):
  {
    "mcpServers": {
      "tube-search": {
        "command": "npx",
        "args": ["-y", "tube-search-mcp"],
        "env": { "TUBE_API_KEY": "tsk_..." }
      }
    }
  }

Docs: https://tube.archivarix.net/guide/mcp`,
  );
}

startProxy(parseArgs()).catch((err: Error) => {
  console.error('Fatal:', err.message || err);
  process.exit(1);
});
