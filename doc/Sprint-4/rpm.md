# Release Plan

## Release Name
**v0.4.0**

---

## Release Objectives

The primary goal of this release is to deploy and validate the updated version of the application, expanding upon v0.3.0 by introducing new core features, improving user experience, and enhancing system reliability. The objectives follow the SMART framework to ensure clarity and accountability.

### Specific Goals

- Upload a `.zip` copy of the project repository to GitHub as part of the release assets.
- Merge the `Dev` branch into `main`, with all changes properly reviewed and approved.
- Tag the `main` branch with `v0.4.0` to mark the official release.
- Verify functionality through integration testing and a structured team review.
- Communicate the full scope and capabilities of the release to the course team and stakeholders.

### Metrics for Measurement

- **Code Deployment Success:** Confirmation that the `.zip` archive is uploaded correctly to the GitHub release page.
- **Branch Merging Completion:** Verification that `Dev` is successfully merged into `main` without unresolved conflicts.
- **Feature Functionality:** 90%+ of test cases pass successfully (unit + integration).
- **Team Understanding:** Completion of a team walkthrough session covering all major features and changes.

---

## Release Scope

### Included Features

- **Workout Scheduling Page** (`SCRUM-9, SCRUM-18`): Allows users to plan workouts with a calendar-based interface.
- **Profile Page** (`SCRUM-28`): Displays personal data, stats, and user-uploaded profile info.
- **Workout Comments and Summaries** (`SCRUM-27`, `SCRUM-22`): Enables community interaction and automatic workout summaries.
- **Data Visualization** (`SCRUM-23`, `SCRUM-19`, `SCRUM-22`, `SCRUM-24`): Users can see frequent workouts, see workouts streaks, summaries and track weights on favourite workouts
- **UI Overhaul** (`SCRUM-84`): Improved styling and usability across the site.

### Excluded Features

- **Custom Achievements**
- **Heatmaps**
- **Delete Conversations**
- **Sharing Videos and Images**

These features were either deferred due to timeline constraints or deprioritized to focus on core functionality.

### Bug Fixes

- **Fixed DB to Profile page disconnect** (`SCRUM-106`)
- **Fixed failing tests** (`SCRUM-82`)
- **Fixed issues with Docker compose** (`SCRUM-37`)
- **Workout Builder not creates timed exercises correctly** (`SCRUM-112`)

### Future Goals (Epics & Key Features)
No Future Features/Epics planned to be implemented
---

## Non-Functional Requirements

- **Authentication System**:  
  All user pages require authentication. The app uses JWT (JSON Web Token) for secure access control. Tokens are generated upon login and stored in localStorage on the client side. Protected API requests must include the token in the header. The backend validates the token before granting access.

- **Performance**:  
  All core views must load in under 2 seconds on standard connections. Data fetching is optimized with caching and lazy loading for non-essential elements.

- **Accessibility**:  
  Interfaces adhere to basic accessibility standards (WCAG), including keyboard navigation and screen-reader support.

---

### Dependencies and Limitations

- **External Video Hosting**  
  The embedded reference videos rely on YouTube URLs, meaning if a video is removed or made private, it will no longer be available in the app.

- **Authentication System Dependency**  
  The system depends on JWT for authentication, requiring a secure and reliable token storage mechanism on the client-side.

---
