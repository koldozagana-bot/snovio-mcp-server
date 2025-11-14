# Snov.io MCP Server

MCP (Model Context Protocol) server for integrating Snov.io email finding and verification capabilities with Claude Desktop.

## Features

- 🔍 **Email Finder** - Find email addresses by name and domain
- ✅ **Email Verifier** - Verify email deliverability
- 🌐 **Domain Search** - Find all emails from a domain
- 💼 **LinkedIn Search** - Find emails from LinkedIn profiles

## Quick Start

### 1. Get Your Snov.io API Key

1. Sign up at [snov.io](https://snov.io)
2. Go to [API Settings](https://app.snov.io/account/api)
3. Copy your API key

### 2. Configure Environment

```bash
# Edit .env file and add your key
SNOVIO_API_KEY=your_actual_api_key_here
```

### 3. Build the Server

```bash
npm run build
```

### 4. Test with MCP Inspector

```bash
npm run inspect
```

### 5. Configure Claude Desktop

Add to your Claude Desktop config:

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`  
**Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Linux:** `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "snovio": {
      "command": "node",
      "args": ["C:/absolute/path/to/dist/index.js"],
      "env": {
        "SNOVIO_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Run MCP Inspector for testing
npm run inspect
```

## Available Tools

### snovio_find_email
Find an email address by person's name and company domain.

### snovio_verify_email
Check if an email address is valid and deliverable.

### snovio_domain_search
Find all email addresses associated with a domain.

### snovio_linkedin_search
Find email address from a LinkedIn profile URL.

## License

MIT
