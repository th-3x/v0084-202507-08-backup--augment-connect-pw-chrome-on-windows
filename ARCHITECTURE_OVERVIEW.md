# Architecture Overview - Playwright Chrome Connection PoC

## Clean Architecture Implementation

This project follows Clean Architecture principles with clear separation of concerns across four main layers.

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              PlaywrightController                   │   │
│  │  - User interface and interaction                   │   │
│  │  - Error handling and user feedback                 │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         PlaywrightApplicationService                │   │
│  │  - Orchestrates use cases                           │   │
│  │  - Manages browser connections                      │   │
│  │  - Handles retry logic                              │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  Use Cases                          │   │
│  │  - WebScrapingUseCase                               │   │
│  │  - FormAutomationUseCase                            │   │
│  │  - ScreenshotUseCase                                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Domain Layer                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   Entities                          │   │
│  │  - BrowserSession                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 Interfaces                          │   │
│  │  - IBrowserRepository                               │   │
│  │  - IAutomationService                               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         PlaywrightBrowserRepository                 │   │
│  │  - Manages Chrome connections                       │   │
│  │  - Session lifecycle management                     │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │        PlaywrightAutomationService                  │   │
│  │  - Web scraping implementation                      │   │
│  │  - Form automation implementation                   │   │
│  │  - Screenshot capture implementation                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

### Domain Layer (`src/domain/`)

#### Entities
- **BrowserSession** (`entities/BrowserSession.ts`)
  - Encapsulates browser connection state
  - Manages page creation and lifecycle
  - Provides connection information

#### Repository Interfaces
- **IBrowserRepository** (`repositories/IBrowserRepository.ts`)
  - Defines contract for browser connection management
  - Session creation, retrieval, and cleanup operations

#### Service Interfaces
- **IAutomationService** (`services/IAutomationService.ts`)
  - Defines contract for automation operations
  - Web scraping, form filling, screenshot capture

### Infrastructure Layer (`src/infrastructure/`)

#### Repository Implementations
- **PlaywrightBrowserRepository** (`repositories/PlaywrightBrowserRepository.ts`)
  - Implements IBrowserRepository using Playwright
  - Manages Chrome CDP connections
  - Handles connection failures and retries

#### Service Implementations
- **PlaywrightAutomationService** (`services/PlaywrightAutomationService.ts`)
  - Implements IAutomationService using Playwright
  - Provides concrete automation capabilities
  - Error handling and logging

### Application Layer (`src/application/`)

#### Use Cases
- **WebScrapingUseCase** (`usecases/WebScrapingUseCase.ts`)
  - Business logic for web scraping
  - Extracts data from Hacker News
  - Demonstrates data extraction patterns

- **FormAutomationUseCase** (`usecases/FormAutomationUseCase.ts`)
  - Business logic for form automation
  - Fills forms on W3Schools demo
  - Shows form interaction capabilities

- **ScreenshotUseCase** (`usecases/ScreenshotUseCase.ts`)
  - Business logic for screenshot capture
  - Captures full-page screenshots
  - Demonstrates visual testing capabilities

#### Application Services
- **PlaywrightApplicationService** (`services/PlaywrightApplicationService.ts`)
  - Orchestrates all use cases
  - Manages connection establishment
  - Implements retry and fallback logic

### Presentation Layer (`src/presentation/`)

#### Controllers
- **PlaywrightController** (`controllers/PlaywrightController.ts`)
  - User interface for running the demo
  - Error handling and user feedback
  - Troubleshooting information

### Shared Components (`src/shared/`)

#### Types (`types/index.ts`)
- **ChromeConnectionConfig**: Connection configuration
- **BrowserConnectionResult**: Connection attempt results
- **UseCaseResult**: Standardized use case results
- **ScrapingResult, FormData, ScreenshotOptions**: Domain-specific types

#### Utilities (`utils/RetryUtils.ts`)
- **RetryUtils**: Retry logic with exponential backoff
- Configurable retry attempts and delays
- Generic retry mechanism for any operation

### Configuration (`src/config/`)

#### Configuration Management
- **AppConfig** (`AppConfig.ts`)
  - Singleton configuration manager
  - Environment variable processing
  - Type-safe configuration access

## Data Flow

### 1. Application Startup
```
index.ts → PlaywrightController → PlaywrightApplicationService
```

### 2. Connection Establishment
```
PlaywrightApplicationService → PlaywrightBrowserRepository → Chrome CDP
```

### 3. Use Case Execution
```
Use Case → PlaywrightAutomationService → BrowserSession → Playwright API
```

### 4. Error Handling
```
Any Layer → RetryUtils → Exponential Backoff → Retry or Fail
```

## Design Patterns Used

### 1. Repository Pattern
- **IBrowserRepository** abstracts browser connection management
- Allows for easy testing and different browser implementations

### 2. Service Pattern
- **IAutomationService** abstracts automation operations
- Separates business logic from implementation details

### 3. Singleton Pattern
- **AppConfig** ensures consistent configuration across the application

### 4. Dependency Injection
- Constructor injection throughout all layers
- Enables testability and loose coupling

### 5. Strategy Pattern
- Connection fallback strategy (local → remote)
- Retry strategy with configurable parameters

## Key Benefits

### 1. Testability
- All dependencies are injected through interfaces
- Easy to mock external dependencies
- Clear separation of concerns

### 2. Maintainability
- Each layer has a single responsibility
- Changes in one layer don't affect others
- Clear dependency direction (inward)

### 3. Extensibility
- Easy to add new use cases
- Simple to support different browsers
- Configurable retry and connection strategies

### 4. Reliability
- Comprehensive error handling
- Retry logic with exponential backoff
- Graceful degradation

### 5. Type Safety
- Full TypeScript implementation
- Compile-time error detection
- IntelliSense support

## File Structure Summary

```
src/
├── index.ts                           # Application entry point
├── domain/                            # Business logic and interfaces
│   ├── entities/
│   │   └── BrowserSession.ts          # Browser session entity
│   ├── repositories/
│   │   └── IBrowserRepository.ts      # Browser repository interface
│   └── services/
│       └── IAutomationService.ts      # Automation service interface
├── infrastructure/                    # External concerns
│   ├── repositories/
│   │   └── PlaywrightBrowserRepository.ts  # Playwright browser implementation
│   └── services/
│       └── PlaywrightAutomationService.ts  # Playwright automation implementation
├── application/                       # Use cases and orchestration
│   ├── usecases/
│   │   ├── WebScrapingUseCase.ts      # Web scraping business logic
│   │   ├── FormAutomationUseCase.ts   # Form automation business logic
│   │   └── ScreenshotUseCase.ts       # Screenshot business logic
│   └── services/
│       └── PlaywrightApplicationService.ts # Application orchestration
├── presentation/                      # User interface
│   └── controllers/
│       └── PlaywrightController.ts    # Main controller
├── shared/                           # Shared utilities
│   ├── types/
│   │   └── index.ts                  # Type definitions
│   └── utils/
│       └── RetryUtils.ts             # Retry utility
└── config/
    └── AppConfig.ts                  # Configuration management
```

This architecture provides a solid foundation for building scalable, maintainable automation solutions with Playwright and TypeScript.
