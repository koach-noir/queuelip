# Claude Code Configuration for queuelip

## Project Overview
queuelip - A Python project focused on queue management and processing.

## Code Style Guidelines
- Follow Python PEP 8 style guide strictly
- Use meaningful variable and function names
- Add comprehensive docstrings for all functions and classes
- Maximum line length: 88 characters (Black formatter compatible)
- Use type hints where possible

## Testing Requirements
- Write unit tests for all new functions using pytest
- Aim for at least 80% code coverage
- Include both positive and negative test cases
- Test edge cases and error conditions
- Place tests in `tests/` directory

## Documentation Standards
- Update README.md for significant changes
- Add inline comments for complex logic
- Document API endpoints with examples
- Keep docstrings up to date
- Use clear, concise language

## Security Considerations
- Validate all user inputs
- Use parameterized queries for database operations
- Implement proper error handling without exposing sensitive data
- Follow secure coding practices
- Review dependencies for vulnerabilities

## Performance Guidelines
- Use efficient algorithms and data structures
- Consider memory usage for large datasets
- Implement proper logging without performance impact
- Use async/await for I/O operations where appropriate

## Code Review Criteria
When reviewing code, focus on:
1. **Security**: Check for potential vulnerabilities
2. **Performance**: Consider efficiency and scalability  
3. **Maintainability**: Ensure code is readable and modular
4. **Testing**: Verify adequate test coverage
5. **Documentation**: Check for clear documentation

## File Structure Conventions
- Place source code in appropriate modules
- Use descriptive file names
- Group related functionality together
- Keep configuration separate from business logic
- Maintain clear separation of concerns

## Dependencies Management
- Keep requirements.txt updated
- Use virtual environments
- Pin dependency versions for stability
- Regularly update and audit dependencies

## Commit and PR Guidelines
- Use conventional commit format
- Create feature branches from main
- Include tests with new features
- Update documentation as needed
- Link PRs to related issues

## Error Handling
- Use appropriate exception types
- Provide meaningful error messages
- Log errors appropriately
- Implement graceful degradation where possible

## Claude Code Usage Tips
- Be specific about requirements
- Provide context about the project
- Mention any constraints or preferences
- Ask for explanations when needed