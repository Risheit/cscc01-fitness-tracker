# Release Plan  

## Release Name: v0.3.0  

---

## Release Objectives  

The primary goal of this release is to successfully deploy and validate the v0.3.0 version of the project. The objectives are defined using the SMART framework to ensure clarity and accountability.

### Specific Goals  
- Upload a .zip copy of the project repository to GitHub.  
- Merge the Dev branch into main, ensuring all changes are properly reviewed and approved.  
- Tag the main branch as v0.3.0 to mark the official release.  
- Verify that all implemented features function as expected through testing and team review.  
- Ensure that the course team fully understands the scope and functionality of the release.

### Metrics for Measurement  
- **Code Deployment Success:** Confirmation that the .zip file is correctly uploaded to GitHub.  
- **Branch Merging Completion:** Verification that the Dev branch has been successfully merged into main with no unresolved conflicts.  
- **Feature Functionality:** At least 90% of test cases pass successfully.  
- **Team Understanding:** A team review session indicating a thorough comprehension of the release features.

---

## Release Scope  

Outline of what is included in and excluded from the release, detailing key features or improvements, bug fixes, non-functional requirements, etc.

### Included Features  
- **Custom Notifications:** As a user, I want to customize notifications for my workouts so that I can be reminded.  
- **User Bio Page:** As a user, I want to be able to create a bio page to share details like my preferred workouts, age, and gym playlist so others can connect with me based on similar interests.  
- **Personalize Workouts:** As a user, I want to personalize my workout by adding or removing exercises from my workout plan so I can workout according to my preference.  
- **Sending Workouts to Messages:** Users can go share links to custom workouts.

### Excluded Features  
- **Data Visualization:** As a user, I want to see my most frequently performed exercises so I can adjust my training routine if needed. (Weren’t able to complete for individual users)  
- **Workout Scheduler Maker:** As a user, I want to input my available times for a workout so I can schedule my workout times. (Didn't get time to do it.)

### Bug Fixes  
- **CORS issue with exercise videos tab:** When selecting another video on the exercise videos tab, it doesn’t load. The browser console reports it as a CORS blocked issue.

---

## Future Goals (Epics & Key Features)  

### Workout Scheduling  
- A custom workout scheduler will allow users to create and save personalized workout routines into a calendar for ease of repetition.

### Data Analytics & Progress Tracking  
- Users will be able to track their workout history, including completed sessions, sets, and reps.  
- Integration of data visualization tools to display progress over time (e.g., graphs for weight lifted, endurance, etc.).  
- Users will receive performance insights and suggestions based on tracked data.

### Social & Community Features  
- Users will be able to post updates about their workouts and share achievements.  
- A comment and like system will enable interaction between users.  
- Users will have the ability to follow friends or trainers to stay updated on their fitness activities.

---

## Non-Functional Requirements  

- **Authentication System:** Authentication is required for all pages to ensure secure access to user data. We use JWT (JSON Web Token) for authentication, where tokens are generated upon login and stored securely on the client-side. Each API request requiring authentication must include the JWT token in the request header. The server verifies the token before granting access.

---

## Dependencies and Limitations  

- **Hosting and Deployment:** The project has not been deployed to a live environment yet. Deployment options need to be considered for future releases.  
- **External Video Hosting:** The embedded reference videos rely on YouTube URLs, meaning if a video is removed or made private, it will no longer be available in the app.  
- **Authentication System Dependency:** The system depends on JWT for authentication, requiring a secure and reliable token storage mechanism on the client-side.
