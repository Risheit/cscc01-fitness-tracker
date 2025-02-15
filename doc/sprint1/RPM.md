# Release Plan

## Release Name: v0.1.0

---

### Release Objectives
The primary goal of this release is to successfully deploy and validate the v0.1.0 version of the project. The objectives are defined using the SMART framework to ensure clarity and accountability.

#### Specific Goals

- **Upload a .zip copy of the project repository to GitHub.**
- **Merge the Dev branch into main**, ensuring all changes are properly reviewed and approved.
- **Tag the main branch as v0.1.0** to mark the official release.
- **Verify that all implemented features function as expected** through testing and team review.
- **Ensure that the course team fully understands the scope and functionality of the release.**

#### Metrics for Measurement

- **Code Deployment Success:** Confirmation that the .zip file is correctly uploaded to GitHub.
- **Branch Merging Completion:** Verification that the Dev branch has been successfully merged into main with no unresolved conflicts.
- **Feature Functionality:** At least 90% of test cases pass successfully.
- **Team Understanding:** A team review session indicating a thorough comprehension of the release features.

---

### Release Scope
Outline of what is included in and excluded from the release, detailing key features or improvements, bug fixes, non-functional requirements, etc.

#### Included Features

- **Exercise Timer:** As a user, I want a timer for exercises and rest periods so I can stay on track during my workouts.
- **User Authentication:** As a user, I want to be able to register and log in to keep my data secure.
- **Next Set Button:** As a user, I want a button to move to the next set for rep-based exercises so that I can track my progress conveniently.
- **Embedded Reference Videos:** As a user, I want embedded reference videos for exercises that I can quickly view during a workout.

#### Excluded Features

- **Audio Cues:** As a user, I want audio cues for exercise transitions so I can stay focused without looking at my screen. (Didn't get around to doing it.)
- **User Bio Page:** As a user, I want to be able to create a bio page to share details like my preferred workouts, age, and gym playlist so others can connect with me based on similar interests. (Did not make the code cutoff due to last-minute finishing touches.)
- **Workout Plan Selection:** As a user, I want to choose a workout plan from a provided set of workout plans so that I can start exercising without creating my own plan. (Didn't get time to do it.)

---

### Future Goals (Epics & Key Features)

#### Workout Browsing & Planning:

- Users will be able to browse different workouts, filter by categories, and view details before selecting one.
- Users will be able to select from preset workout plans curated by experts.
- A custom workout planner will allow users to create and save personalized workout routines.

#### Data Analytics & Progress Tracking:

- Users will be able to track their workout history, including completed sessions, sets, and reps.
- Integration of data visualization tools to display progress over time (e.g., graphs for weight lifted, endurance, etc.).
- Users will receive performance insights and suggestions based on tracked data.

#### Social & Community Features:

- Users will be able to post updates about their workouts and share achievements.
- A comment and like system will enable interaction between users.
- Users will have the ability to follow friends or trainers to stay updated on their fitness activities.

---

### Non-Functional Requirements

- **Authentication System:** Authentication is required for all pages to ensure secure access to user data. We use JWT (JSON Web Token) for authentication, where tokens are generated upon login and stored securely on the client-side. Each API request requiring authentication must include the JWT token in the request header. The server verifies the token before granting access.

---

### Dependencies and Limitations

- **Hosting and Deployment:** The project has not been deployed to a live environment yet. Deployment options need to be considered for future releases.
- **External Video Hosting:** The embedded reference videos rely on YouTube URLs, meaning if a video is removed or made private, it will no longer be available in the app.
- **Authentication System Dependency:** The system depends on JWT for authentication, requiring a secure and reliable token storage mechanism on the client-side.
