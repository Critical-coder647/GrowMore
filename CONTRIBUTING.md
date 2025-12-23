# Contributing to GrowMore

Thank you for your interest in contributing to GrowMore! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, versions)

### Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear use case
   - Expected behavior
   - Mockups or examples (if applicable)

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/growmore.git
   cd growmore
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   ```bash
   # Backend
   cd backend && npm test
   
   # Frontend
   cd frontend && npm test
   
   # AI Service
   cd ai-service && pytest
   ```

5. **Commit with clear messages**
   ```bash
   git commit -m "Add: feature description"
   # or
   git commit -m "Fix: bug description"
   # or
   git commit -m "Update: component/feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide clear description of changes
   - Reference related issues
   - Add screenshots for UI changes

## Development Guidelines

### Code Style

**JavaScript/React:**
- Use ES6+ features
- Functional components with hooks
- Meaningful variable names
- 2 spaces for indentation

**Python:**
- Follow PEP 8
- Type hints where applicable
- Docstrings for functions
- 4 spaces for indentation

### Commit Messages

Format: `Type: Brief description`

Types:
- `Add:` New feature
- `Fix:` Bug fix
- `Update:` Modify existing feature
- `Remove:` Delete code/feature
- `Refactor:` Code restructuring
- `Docs:` Documentation changes
- `Style:` Formatting changes
- `Test:` Test additions/updates

### Testing

- Write tests for new features
- Ensure all tests pass before PR
- Aim for >80% code coverage

### Documentation

- Update README.md for major changes
- Add JSDoc/docstrings to functions
- Update API documentation
- Include inline comments for complex logic

## Project Structure

```
frontend/    - React application
backend/     - Node.js API server
ai-service/  - FastAPI AI service
```

## Questions?

Feel free to open an issue or reach out to the maintainers.

Thank you for contributing! 🚀
