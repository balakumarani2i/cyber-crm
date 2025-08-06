# AI Prompt Library

## Database Design Prompts

### Prompt 1: Initial Schema Generation
**Prompt**: "Design a PostgreSQL database schema for a CRM system that needs to handle customers, deals, tasks, and user authentication. Include proper relationships, constraints, and indexes for optimal performance."

**Context**: Starting a new CRM project, needed normalized database structure
**Output Quality**: 9/10
**Iterations**: 2 refinements for relationship optimization
**Final Result**: Complete Prisma schema with User, Customer, Deal, Task models

### Prompt 2: Schema Optimization
**Prompt**: "Optimize this Prisma schema for better performance and add missing indexes for a CRM system with potential for 10k+ customers"

**Context**: Performance considerations for scaling
**Output Quality**: 8/10
**Modifications**: Added composite indexes and optimized field types

## Code Generation Prompts

### Prompt 3: API Endpoint Creation
**Prompt**: "Create Express.js API endpoints for customer management with full CRUD operations, including input validation using Zod and proper error handling"

**Context**: Backend API development with TypeScript
**Output Quality**: 9/10
**Modifications**: Minor adjustments to error response format

### Prompt 4: React Component Generation
**Prompt**: "Create a React TypeScript component for a customer modal with form validation, including fields for name, email, phone, company, and status with proper TypeScript interfaces"

**Context**: Frontend modal component with form handling
**Output Quality**: 8/10
**Modifications**: Added custom styling and animation classes

### Prompt 5: Authentication System
**Prompt**: "Implement JWT-based authentication system for Express.js with login endpoint, password hashing using bcrypt, and middleware for protecting routes"

**Context**: Security implementation for API
**Output Quality**: 9/10
**Modifications**: Added token refresh logic

## Problem-Solving Prompts

### Prompt 6: Tailwind CSS v4 Configuration
**Prompt**: "Error: Cannot apply unknown utility class `bg-gray-900`. Are you using CSS modules or similar and missing `@reference`? Fix this Tailwind CSS v4 configuration issue"

**Context**: Migration from Tailwind v3 to v4 causing build errors
**Effectiveness**: 10/10 - Immediate solution provided
**Solution**: Changed from `@tailwind` directives to `@import "tailwindcss"`

### Prompt 7: Modal Z-Index Issues
**Prompt**: "Modal popups are appearing behind other elements. Fix the z-index values to ensure modals appear above all other content"

**Context**: UI layering problems with modal components
**Effectiveness**: 10/10 - Quick fix applied
**Solution**: Updated z-index to `z-[9999]` for all modals

### Prompt 8: API Data Format Error
**Prompt**: "Getting 500 error when updating tasks. The API is receiving extra fields like 'customer', 'createdAt', 'updatedAt' that shouldn't be sent. Fix the data format being sent to the API"

**Context**: Backend rejecting frontend data due to extra fields
**Effectiveness**: 9/10 - Identified and fixed data filtering
**Solution**: Created clean data objects with only required fields

### Prompt 9: Date Format Compatibility
**Prompt**: "HTML date input showing error: 'The specified value does not conform to the required format, yyyy-MM-dd'. Fix the date format conversion from ISO string to HTML date input format"

**Context**: Date format mismatch between API and HTML inputs
**Effectiveness**: 10/10 - Immediate solution
**Solution**: Used `new Date(dateString).toISOString().split('T')[0]`

## UI/UX Enhancement Prompts

### Prompt 10: Cyber Theme Implementation
**Prompt**: "Create a futuristic cyber/neon theme for a CRM application using Tailwind CSS with glowing effects, holographic backgrounds, and animated elements"

**Context**: Unique visual identity for the application
**Output Quality**: 8/10
**Modifications**: Refined color palette and animation timing

### Prompt 11: Responsive Design
**Prompt**: "Make this React component responsive for mobile, tablet, and desktop screens using Tailwind CSS responsive utilities"

**Context**: Mobile-first responsive design implementation
**Output Quality**: 9/10
**Modifications**: Fine-tuned breakpoint behavior

### Prompt 12: Animation Effects
**Prompt**: "Add smooth animations and transitions to this component including hover effects, loading states, and entrance animations using CSS and Tailwind"

**Context**: Enhanced user experience with micro-interactions
**Output Quality**: 8/10
**Modifications**: Adjusted animation duration and easing

## Performance Optimization Prompts

### Prompt 13: React Performance
**Prompt**: "Optimize this React component for large datasets with virtual scrolling and efficient re-rendering patterns"

**Context**: Performance issues with large customer lists
**Output Quality**: 7/10
**Modifications**: Implemented custom virtualization solution

### Prompt 14: Database Query Optimization
**Prompt**: "Optimize these Prisma queries for better performance, including proper includes, selects, and pagination"

**Context**: Slow API responses with large datasets
**Output Quality**: 8/10
**Modifications**: Added query result caching

## Debugging Prompts

### Prompt 15: Error Diagnosis
**Prompt**: "Analyze this error stack trace and provide a solution: [error details]. The error occurs when trying to save a task through the modal form"

**Context**: Runtime error troubleshooting
**Effectiveness**: 9/10 - Quickly identified root cause
**Solution**: Fixed data validation and API payload format

### Prompt 16: Build Configuration
**Prompt**: "Fix this Vite build error related to TypeScript configuration and module resolution in a React project"

**Context**: Build pipeline issues during development
**Effectiveness**: 8/10 - Provided configuration fixes
**Solution**: Updated tsconfig.json and vite.config.ts

## Testing Prompts

### Prompt 17: Test Case Generation
**Prompt**: "Generate comprehensive test cases for this API endpoint including success scenarios, error cases, and edge cases using Jest"

**Context**: API testing implementation
**Output Quality**: 8/10
**Modifications**: Added integration test scenarios

### Prompt 18: Component Testing
**Prompt**: "Create React Testing Library tests for this modal component including form validation, user interactions, and API integration"

**Context**: Frontend component testing
**Output Quality**: 7/10
**Modifications**: Enhanced accessibility testing

## Documentation Prompts

### Prompt 19: API Documentation
**Prompt**: "Generate comprehensive API documentation for these Express.js endpoints including request/response schemas, authentication requirements, and example usage"

**Context**: Developer documentation creation
**Output Quality**: 9/10
**Modifications**: Added more detailed examples

### Prompt 20: Code Comments
**Prompt**: "Add comprehensive JSDoc comments to this TypeScript code including parameter descriptions, return types, and usage examples"

**Context**: Code documentation for maintainability
**Output Quality**: 8/10
**Modifications**: Standardized comment format

## Deployment Prompts

### Prompt 21: Production Configuration
**Prompt**: "Configure this Node.js application for production deployment including environment variables, security headers, and performance optimizations"

**Context**: Production deployment preparation
**Output Quality**: 8/10
**Modifications**: Added monitoring and logging setup

### Prompt 22: Docker Configuration
**Prompt**: "Create Docker configuration for this full-stack application with separate containers for frontend, backend, and database"

**Context**: Containerization for deployment
**Output Quality**: 7/10
**Modifications**: Optimized image sizes and build process

## Prompt Effectiveness Summary

### Most Effective Prompt Categories:
1. **Problem Solving** (9.2/10 avg) - Excellent for debugging and error resolution
2. **Code Generation** (8.6/10 avg) - Strong for boilerplate and standard patterns
3. **Configuration Fixes** (9.0/10 avg) - Outstanding for setup and config issues

### Areas Requiring Human Input:
- Complex business logic decisions
- Creative design choices
- Performance optimization strategies
- User experience considerations

### Best Practices Learned:
1. **Be Specific**: Include exact error messages and context
2. **Iterative Refinement**: Start broad, then narrow down requirements
3. **Provide Context**: Include relevant code snippets and environment details
4. **Validate Output**: Always test AI-generated solutions before implementation