# Contributing to PromptCompare

First off, thank you for considering contributing to PromptCompare! 🎉

It's people like you that make PromptCompare such a great tool for the AI community.

## 👋 Welcome

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## 🛠️ Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher
- Git

### Setup

```bash
# Clone your fork
git clone https://github.com/your-username/promptcompare.git
cd promptcompare

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your API keys to .env.local
# At minimum, add GROQ_API_KEY for testing

# Run development server
npm run dev
```

## 📝 Code Style

We use:

- **TypeScript** for type safety
- **ESLint** for linting
- **Prettier** for formatting

```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Lint
npm run lint

# Type check
npm run type-check
```

## 📄 Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:
```
feat: add support for Claude 3 models
```

## 🐛 Reporting Bugs

We use GitHub issues to track bugs. Report a bug by [opening a new issue](https://github.com/ogetynarendra/promptcompare/issues/new).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening)

## ✨ Feature Requests

We welcome feature requests! Please:

1. Check if the feature has already been requested
2. Provide a clear description of the feature
3. Explain why it would be useful
4. Include mockups if applicable

## 🎯 Priority Areas

We're especially interested in contributions for:

### High Priority
- ✅ Additional LLM provider integrations (OpenAI, Anthropic, etc.)
- ✅ Token counting accuracy improvements
- ✅ Cost calculation refinements
- ✅ Response streaming support

### Medium Priority
- 📊 Advanced analytics and metrics
- 📤 Export functionality (CSV, JSON)
- 📖 Prompt template library
- 🌨️ Dark/light mode toggle

### Nice to Have
- 📊 Diff view for comparing responses
- 👥 User authentication
- 💾 Saved comparison history
- 🤝 Team collaboration features

## 📚 Adding a New LLM Provider

To add a new LLM provider:

1. **Install SDK** (if available)
   ```bash
   npm install @provider/sdk
   ```

2. **Update `.env.example`**
   ```env
   PROVIDER_API_KEY=your_api_key_here
   ```

3. **Add to `route.ts`**
   ```typescript
   // Initialize client
   const providerClient = process.env.PROVIDER_API_KEY 
     ? new ProviderSDK({ apiKey: process.env.PROVIDER_API_KEY })
     : null;

   // Add handler function
   async function callProviderAPI(prompt: string): Promise<{ response: string; tokens: number }> {
     // Implementation
   }

   // Add to modelMap
   'provider-model': {
     name: 'Provider Model Name',
     provider: 'Provider',
     handler: () => providerClient ? callProviderAPI(prompt) : mockAPICall(prompt, 'Provider Model Name'),
   }
   ```

4. **Update pricing in `MODEL_PRICING`**

5. **Update README** with new provider info

6. **Test thoroughly**

## ✔️ Testing

Before submitting:

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Test locally
npm run dev
# Visit http://localhost:3000 and test your changes
```

## 📜 Documentation

If you're changing user-facing functionality:

- Update the README.md
- Add inline code comments
- Update API documentation if applicable

## 🤝 Community

- Be respectful and welcoming
- Help others learn and grow
- Give credit where credit is due
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md) (coming soon)

## 💬 Questions?

Feel free to:

- Open a [GitHub Discussion](https://github.com/ogetynarendra/promptcompare/discussions)
- Comment on an existing issue
- Reach out to [@ogetynarendra](https://github.com/ogetynarendra)

## 🚀 Release Process

1. Maintainers review and merge PRs
2. Version bump follows [Semantic Versioning](https://semver.org/)
3. Release notes are generated
4. Deployment to production

## 🔑 API Keys for Testing

**Never commit API keys!**

For testing, use free-tier API keys:

- **Groq**: [https://console.groq.com](https://console.groq.com) (Recommended - Ultra fast & free)
- **Google Gemini**: [https://makersuite.google.com](https://makersuite.google.com)
- **Mistral**: [https://console.mistral.ai/](https://console.mistral.ai/)

## 🏆 Recognition

All contributors will be:

- Listed in the README
- Credited in release notes
- Given our eternal gratitude! 🙏

---

**Thank you for contributing to PromptCompare!** ❤️

Your efforts help make LLM comparison accessible to everyone in the AI community.
