import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

export interface ProxyOptions {
  apiKey: string;
  mcpUrl: string;
}

export async function startProxy({ apiKey, mcpUrl }: ProxyOptions): Promise<void> {
  // Connect to remote MCP server
  const remoteClient = new Client(
    { name: 'tube-search-proxy', version: '1.0.0' },
    { capabilities: {} },
  );

  const httpTransport = new StreamableHTTPClientTransport(new URL(mcpUrl), {
    requestInit: {
      headers: { Authorization: `Bearer ${apiKey}` },
    },
  });

  await remoteClient.connect(httpTransport);

  const serverCapabilities = remoteClient.getServerCapabilities();

  // Create local stdio server that mirrors remote capabilities
  const localServer = new Server(
    { name: 'tube-search', version: '1.0.0' },
    {
      capabilities: {
        tools: serverCapabilities?.tools ? {} : undefined,
        resources: serverCapabilities?.resources ? {} : undefined,
        prompts: serverCapabilities?.prompts ? {} : undefined,
      },
      instructions: remoteClient.getInstructions(),
    },
  );

  // Proxy: tools
  localServer.setRequestHandler(ListToolsRequestSchema, async (request) => {
    return await remoteClient.listTools(request.params);
  });

  localServer.setRequestHandler(CallToolRequestSchema, async (request) => {
    return await remoteClient.callTool(request.params);
  });

  // Proxy: resources
  localServer.setRequestHandler(ListResourcesRequestSchema, async (request) => {
    return await remoteClient.listResources(request.params);
  });

  localServer.setRequestHandler(ListResourceTemplatesRequestSchema, async (request) => {
    return await remoteClient.listResourceTemplates(request.params);
  });

  localServer.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    return await remoteClient.readResource(request.params);
  });

  // Proxy: prompts
  localServer.setRequestHandler(ListPromptsRequestSchema, async (request) => {
    return await remoteClient.listPrompts(request.params);
  });

  localServer.setRequestHandler(GetPromptRequestSchema, async (request) => {
    return await remoteClient.getPrompt(request.params);
  });

  // Cleanup on exit
  const cleanup = async () => {
    try {
      await httpTransport.terminateSession();
    } catch {
      // ignore — server may not support session termination
    }
    await localServer.close();
    await remoteClient.close();
  };

  process.on('SIGINT', () => void cleanup().then(() => process.exit(0)));
  process.on('SIGTERM', () => void cleanup().then(() => process.exit(0)));

  // Start stdio transport
  const stdioTransport = new StdioServerTransport();
  await localServer.connect(stdioTransport);

  console.error(`tube-search-mcp: connected to ${mcpUrl}`);
}
