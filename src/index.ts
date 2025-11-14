import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { SnovioClient } from './utils/api-client.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize server
const server = new Server({
  name: 'snovio-mcp-server',
  version: '1.0.0',
  description: 'MCP server for Snov.io email finding and verification'
});

// Initialize API client
const apiKey = process.env.SNOVIO_API_KEY;
if (!apiKey) {
  console.error('Error: SNOVIO_API_KEY environment variable is not set');
  process.exit(1);
}

const snovioClient = new SnovioClient(apiKey);

// Define Zod schemas for input validation
const FindEmailSchema = z.object({
  domain: z.string().min(1, 'Domain is required'),
  fullName: z.string().min(1, 'Full name is required')
});

const VerifyEmailSchema = z.object({
  email: z.string().email('Invalid email format')
});

const DomainSearchSchema = z.object({
  domain: z.string().min(1, 'Domain is required'),
  limit: z.number().int().positive().default(100)
});

const LinkedinSearchSchema = z.object({
  linkedinUrl: z.string().url('Invalid URL')
});

server.setRequestHandler('tools/call' as any, async (request: any) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'snovio_find_email': {
        const { domain, fullName } = FindEmailSchema.parse(args);
        const result = await snovioClient.emailFinder(domain, fullName);
        
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify(result, null, 2)
          }]
        };
      }

      case 'snovio_verify_email': {
        const { email } = VerifyEmailSchema.parse(args);
        const result = await snovioClient.emailVerifier(email);
        
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify(result, null, 2)
          }]
        };
      }

      case 'snovio_domain_search': {
        const { domain, limit } = DomainSearchSchema.parse(args);
        const result = await snovioClient.domainSearch(domain, limit);
        
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify(result, null, 2)
          }]
        };
      }

      case 'snovio_linkedin_search': {
        const { linkedinUrl } = LinkedinSearchSchema.parse(args);
        const result = await snovioClient.linkedinSearch(linkedinUrl);
        
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify(result, null, 2)
          }]
        };
      }

      default:
        return {
          content: [{
            type: 'text' as const,
            text: `Unknown tool: ${name}`
          }],
          isError: true
        };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [{
        type: 'text' as const,
        text: `Error: ${errorMessage}`
      }],
      isError: true
    };
  }
});

// Set up tools list handler
server.setRequestHandler('tools/list' as any, async () => {
  return {
    tools: [
      {
        name: 'snovio_find_email',
        description: 'Find email address by person name and company domain',
        inputSchema: {
          type: 'object',
          properties: {
            domain: {
              type: 'string',
              description: 'Company domain (e.g., example.com)'
            },
            fullName: {
              type: 'string',
              description: 'Full name of the person'
            }
          },
          required: ['domain', 'fullName']
        }
      },
      {
        name: 'snovio_verify_email',
        description: 'Verify if an email address is valid and deliverable',
        inputSchema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'Email address to verify'
            }
          },
          required: ['email']
        }
      },
      {
        name: 'snovio_domain_search',
        description: 'Find all email addresses associated with a domain',
        inputSchema: {
          type: 'object',
          properties: {
            domain: {
              type: 'string',
              description: 'Domain to search for emails'
            },
            limit: {
              type: 'number',
              description: 'Maximum results (default: 100, max: 100)',
              default: 100
            }
          },
          required: ['domain']
        }
      },
      {
        name: 'snovio_linkedin_search',
        description: 'Find email address from LinkedIn profile URL',
        inputSchema: {
          type: 'object',
          properties: {
            linkedinUrl: {
              type: 'string',
              description: 'LinkedIn profile URL'
            }
          },
          required: ['linkedinUrl']
        }
      }
    ]
  };
});

// Start the server
async function startServer() {
  const transport = new StdioServerTransport();
  
  try {
    await server.connect(transport);
    console.error('✅ Snov.io MCP Server started successfully');
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer().catch(console.error);
