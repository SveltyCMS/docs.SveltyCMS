---
title: "System Logging"
description: "This module provides a customizable logger for your application."
icon: "mdi:console" 
published: true
---

# Logger.ts

This module provides a customizable logger for your application. It allows you to log messages at different levels (trace, debug, info, warn, error, fatal) and control which levels are enabled through environment variables.

## Usage

1. **Import the logger:**

   ```typescript
   import logger from './logger'; // Assuming logger.ts is in the same directory
   ```

2. **Log messages at different levels:**

   ```typescript
   logger.info('This is an informational message.');
   logger.warn('This is a warning message.');
   logger.error('This is an error message.', { errorDetails: 'Something went wrong!' });
   ```

   Each logging method accepts an optional second argument for additional log details, which can be an object or a string.

## Configuration

The logger's behavior is controlled by the `LOG_LEVELS` environment variable. This variable should be set to a comma-separated list of enabled log levels. The logger will log messages at the specified levels and above.

**Example:**

To enable `info`, `warn`, and `error` levels:

```bash
LOG_LEVELS=info,warn,error
```

In this case, `trace` and `debug` messages will be suppressed.

**Default Log Level:**

If the `LOG_LEVELS` environment variable is not set, the logger will default to the `info` level.

## Log Levels

- **trace:** Use for extremely detailed logging, typically only useful during development.
- **debug:** Use for debugging information, such as variable values or function arguments.
- **info:** Use for general informational messages about the application's state.
- **warn:** Use for warnings about potential issues that are not yet errors.
- **error:** Use for errors that occur during the application's execution.
- **fatal:** Use for critical errors that cause the application to terminate.

## Example

```typescript
import logger from './logger';

// Log an info message
logger.info('Application started.');

try {
  // Some code that might throw an error
  throw new Error('Something went wrong!'); 
} catch (error) {
  // Log the error with details
  logger.error('An error occurred.', { error }); 
}
```
