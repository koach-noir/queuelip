# Claude Code Configuration for queuelip

## Project Overview
queuelip - A Tauri-based desktop application built with JavaScript/HTML/CSS and Rust backend.

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Rust (Tauri framework)
- **Build Tool**: Vite.js
- **Package Manager**: npm

## Code Style Guidelines

### JavaScript
- Use ES6+ features consistently
- Follow standard JavaScript style guide
- Use meaningful variable and function names
- Add JSDoc comments for functions
- Use const/let instead of var
- Maximum line length: 100 characters

### HTML/CSS
- Use semantic HTML5 elements
- Follow BEM methodology for CSS classes
- Use CSS Grid/Flexbox for layouts
- Ensure responsive design principles
- Optimize for accessibility (ARIA attributes)

### Rust (Tauri)
- Follow Rust standard conventions
- Use cargo fmt for formatting
- Add comprehensive documentation
- Handle errors properly with Result types
- Use descriptive function and variable names

## Project Structure
- `index.html` - Main application entry point
- `mini.html` - Minimal version
- `js/` - JavaScript modules and logic
- `css/` - Stylesheets and design assets
- `src-tauri/` - Rust backend code
- `package.json` - Node.js dependencies
- `vite.config.js` - Build configuration

## Testing Requirements
- Write unit tests for JavaScript functions
- Test Tauri commands and backend logic
- Use appropriate testing frameworks
- Test cross-platform compatibility
- Include end-to-end testing for critical paths

## Security Considerations
- Validate all user inputs in both frontend and backend
- Use Tauri's security features properly
- Implement proper CSP (Content Security Policy)
- Sanitize data before displaying
- Review Tauri permissions carefully

## Performance Guidelines
- Optimize bundle size with Vite
- Use efficient DOM manipulation
- Implement lazy loading where appropriate
- Optimize Tauri app startup time
- Consider memory usage in long-running operations

## Build and Development
- Use `npm run dev` for development
- Use `npm run build` for production builds
- Follow the build instructions in BUILDING.md
- Test builds on target platforms

## Code Review Criteria
When reviewing code, focus on:
1. **Security**: Tauri security best practices
2. **Performance**: Bundle size and runtime efficiency
3. **Cross-platform**: Compatibility across OS
4. **User Experience**: Interface responsiveness
5. **Code Quality**: Maintainability and readability

## Tauri-Specific Guidelines
- Use appropriate Tauri APIs for system integration
- Handle platform differences gracefully
- Implement proper error handling for Tauri commands
- Consider app permissions and security model
- Follow Tauri's recommended project structure

## File Naming Conventions
- Use kebab-case for HTML/CSS files
- Use camelCase for JavaScript files
- Follow Rust naming conventions for backend
- Use descriptive names that reflect functionality

## Dependencies Management
- Keep package.json updated
- Regularly audit npm dependencies
- Update Tauri and Rust dependencies
- Document any breaking changes

## Documentation Standards
- Update README.md for user-facing changes
- Document Tauri commands and their usage
- Add comments for complex business logic
- Maintain API documentation if applicable

## Git Workflow
- Use conventional commit messages
- Create feature branches from main
- Include tests with new features
- Update documentation as needed
- Link PRs to related issues

## Error Handling
- Implement proper error boundaries
- Provide meaningful error messages to users
- Log errors appropriately for debugging
- Handle network and file system errors gracefully

## Claude Code Usage Tips
- Specify whether changes are for frontend or backend
- Mention target platforms if relevant
- Include context about Tauri-specific requirements
- Ask for cross-platform considerations when needed