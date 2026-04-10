# Contributing to Devvscape 

Thank you for your interest in contributing to Devvscape! This document provides guidelines and information for contributors.

##  How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include as many details as possible:

**Bug Report Template:**
```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. iOS, Android, Windows]
 - Browser: [e.g. chrome, safari]
 - Version: [e.g. 22]
 - Device: [e.g. iPhone 6, Samsung Galaxy]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Enhancements

We welcome feature requests! Please use the enhancement template:

**Enhancement Template:**
```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

### Pull Requests

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Test** your changes thoroughly
5. **Commit** your changes with a clear message
6. **Push** to your branch
7. **Open** a Pull Request

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Git
- Android Studio (for Android development)

### Local Development

1. **Fork and clone** the repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/devvscape-code-humor.git
   cd devvscape-code-humor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   - Copy `src/environments/environment.example.ts` to `src/environments/environment.ts`
   - Update with your Firebase configuration

4. **Start development server**
   ```bash
   npm start
   ```

## Testing

### Running Tests

```bash
# Unit tests
npm test

# Tests with coverage
npm run test:coverage

# E2E tests
npm run e2e

# Linting
npm run lint
```

### Test Coverage

We aim for at least 80% test coverage. Please ensure your contributions include appropriate tests.

## Code Style

### TypeScript/Angular Guidelines

- Use **TypeScript** for all new code
- Follow **Angular style guide** conventions
- Use **strict mode** TypeScript
- Prefer **interfaces** over types for object shapes
- Use **enums** for constants

### Code Formatting

- Use **Prettier** for code formatting
- Use **ESLint** for code linting
- Follow **conventional commits** for commit messages

### File Naming

- Use **kebab-case** for file names
- Use **PascalCase** for component names
- Use **camelCase** for variables and functions

## Git Workflow

### Branch Naming

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/urgent-fix` - Critical fixes
- `docs/documentation-update` - Documentation updates

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

## Architecture Guidelines

### State Management

- Use **NgRx** for global state
- Keep components **stateless** when possible
- Use **selectors** for data access
- Follow **Redux patterns**

### Services

- Keep services **focused** and **single-purpose**
- Use **dependency injection**
- Handle **errors** appropriately
- Return **observables** for async operations

## Security

### Security Guidelines

- Never commit **secrets** or **API keys**
- Use **environment variables** for configuration
- Validate **user input**
- Follow **OWASP guidelines**
- Report security issues privately

## Documentation

### Code Documentation

- Use **JSDoc** for public APIs
- Document **complex logic**
- Include **usage examples**
- Keep documentation **up-to-date**

## Release Process

### Version Management

We use [Semantic Versioning](https://semver.org/):

- **MAJOR** - Breaking changes
- **MINOR** - New features (backward compatible)
- **PATCH** - Bug fixes (backward compatible)

## Community Guidelines

### Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read our [Code of Conduct](CODE_OF_CONDUCT.md).

### Communication

- Be **respectful** and **inclusive**
- Use **clear** and **constructive** language
- Provide **context** for suggestions
- Be **patient** with newcomers

## Contact

- **Discord**: [Join our community](https://discord.gg/vpS3Uu88)
- **Email**: contributors@devvscape.com
- **Twitter**: [@b4r0id](https://x.com/b4r0id)

---

**Thank you for contributing to Devvscape!**

*Your contributions help make this project better for everyone.*
