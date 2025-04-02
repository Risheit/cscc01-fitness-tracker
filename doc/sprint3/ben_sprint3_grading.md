# Sprint 3 Marking Scheme

**Team Name:** Ben  

---

## Version Control (max 5 marks)

- Consistent Usage of Git (2.5 pt):
  - 1 pts: Regular and consistent commits demonstrating incremental progress in the project.
  - 1 pt:  Demonstrated proficiency in basic Git commands (e.g., commit, push, pull, merge) and usage based on the contribution guidelines described by the team in their README.
  - 0.5 pts: Meaningful commit messages that convey the purpose of each change.

- Branches/Naming/Organization (2.5 pt)
  - 1 pts: Proper utilization of branches for feature development, bug fixes, etc. Should have feature branches for each user story that differs significantly in logic.
  - 1 pts: Use of Pull Requests and/or avoidance of direct uploads and merging zip files.
    - Should not directly commit each change to the main branch.
    - Should ideally merge branches using pull request feature on GitHub.
    - Should not manually merge zips from different branches in one local repo - bad practice
  - 0.5 pts: Clear and meaningful branch naming conventions that reflect the purpose of the branch.

Version Control Total Mark: 5 / 5

——
## Code Quality (max 6 marks)

- Proper naming: 1 mark
- Indentation and spacing: 1 mark
- Proper use of comments: 1 mark
- Consistent coding style: 1.5 mark
- Code is easy to modify and re-use: 1.5 mark

Code Quality Total Mark: 6 / 6

**Grader's Notes:** In your `page.tsx`, you call `getAllWorkoutPlans()` without proper error handling like you have in other calls to the same function, which could lead to unexpected crashes.
- (The above is a repeat feedback from sprint 2 but since sprint 2 marks came out late, will not deduct marks twice.)
  - However, if this is still an issue in sprint 4, marks will be deducted then.

——
## UI Design and Ease of Use (8 marks):
Visual Design/GUI (4 marks):
-	The UI demonstrates a cohesive and visually appealing design with appropriate color schemes, fonts, and visual elements: 1.5 mark
-	Consistent branding and styling are applied throughout the application and creative and thoughtful use of design elements that enhance the overall aesthetics: 1.5 mark
-	Intuitive navigation with clear and logically organized menus, buttons, or tabs: 1 mark
 
Ease of Use (4 marks):
-	Intuitiveness and simplicity in the user interactions, very minimal learning curve: 1.5 mark
-	Interactivity and Responsiveness: 1.5 mark
-	Clear and user-friendly error messages that guide users in resolving issues or success messages: 1 mark

UI Design and Ease of Use Total Mark: 8 / 8

——
## BackLog Management  (10 mark)
- Jira is used proficiently to manage user stories, tasks, and sprints.
- An even distribution of user stories across multiple sprints, not all in one sprint.
- An even distribution of user stories amongst group members.
- Completion and thoughtful organization of the Jira Board and Backlog
- Should use subtask/child issues feature to break down user stories instead of creating a large pool of unclassified tasks/user stories.
- Each user story / task in sprint 3 has been assigned story estimation points.
- All tasks/user stories in sprint 3 should be completed.

Note (for TAs): a completed sprint may be hidden from the Backlog/Board.
  - You need to find/recover them manually.
  - Do not deduct marks for completed sprints, therefore stories that disappeared.

Deduct 1/1.5 marks for each criteria violated.

Backlog Management Total Mark: 8.5 / 10

**Grader's Notes:**
- There were 4 stories in sprint 3 that were not completed.

—
## Project Tracking (max 10 marks)
- Burndown chart is accurate, correctly reflecting tasks completed and remaining.
- The burndown smoothly tracks progress, reflecting team velocity and workload.
- Network diagram to show the critical path and documenting the findings in schedule.pdf
- Ideal vs. actual progress is clearly represented for comparison.

Deduct 2/2.5 marks for each criteria violated.

If the burndown chart is flat, no marks should be provided

Project Tracking Total Mark: 7.5 / 10

**Grader's Notes:** Missing network diagram and critical path in schedule.pdf.

---
## Planning Meetings (RPM.md, sprint3.md) (max 5 marks)
- RPM.md (Release Planning Meetings) (max 2.5 marks)
  - 2.5 marks = Release goals are specified and there are sufficient references to included features, excluded features, bug fixes, non-functional requirement, dependency & limitation to be completed during the release
    
Deduct 0.5 marks for each criteria violated.
    
Your Mark: 2.5

- Sprint Planning meeting (sprint3.md) (max 2.5 marks)
  - 2.5 marks = Meeting and sprint goal is documented, all spikes clearly identified, team capacity recorded, participants are recorded, everyone has participated, decisions about user stories to be completed this sprint are clear, tasks breakdown is done. 

Deduct 0.5  marks for each criteria violated.

Your Mark: 2.5

Planning Meetings Total Mark: 5 / 5

—

---
## Team Communication (5 marks)
---
### Daily Stand-ups (max 3 marks)
- Team updates are done on the Slack server within your team's #standup channel
  - Standup Format:
    [Standup Date] - Sprint # Standup #
    1. What did you work on since the last standup?
    2. What do you commit to next? 
    3. When do you think you'll be done?
    4. Do you have any blockers?
      
- Each group is required to post a minimum of 6 standups per sprint (Max 6 marks; 0.5 marks per daily standup)
- Standup updates answers the necessary questions and is good quality
  - 0.5 marks = All teams members have sent their updates in the channel and are well written/good quality. Each team member consistently addresses the above four questions:

Deduct 0.1 points for each standup missed for up to 0.5 point in total.
  - For full marks, at least 6 standups need to be present.

Daily Stand-ups Total Mark: 3 / 3

### Sprint Retrospective (max 2 marks)
- Sprint Retrospective (max 2 marks)
  - 2 marks = Includes a comprehensive review of what went well during the sprint, identifying specific examples of successes and effective practices.
              Proposes practical and realistic actions to address identified challenges and improve future sprints

Deduct 0.5 points for each criteria violated.

Sprint Retro Total Mark: 2 / 2

Team Communication Mark: 5 / 5

—
## NFR (max 14 marks)

- Well-structured, follows required format, and placed correctly in doc/sprint3 folder as NFR.pdf (3 marks)
- Clearly explains why the 3 NFRs were prioritized, with strong rationale and categorization, maligning with project needs (3 marks)
- Well-explained (min 2) trade-offs, highlighting benefits and reasoning behind choices. (2 marks)
- Includes detailed test results, best practices, and explanation implementation. 2 marks for each NFR implementation (6 marks)

Deduct marks if NFR are generic and not aligned with project goals and needs

NFR Implementation Total Mark: 14 / 14

—
## Unit Testing (max 8 marks)
- Covers all critical functions and edge cases. (2 marks)
- Tests are well-structured, modular, and maintainable. (2 marks)
- Thoroughly tests edge cases (boundary values, errors) (2 marks)
- Tests run successfully with clear output. (2 marks)

Unit Testing Total Mark:  4 / 8

**Grader's Notes:** Following your README instructions, I ran `npm test` in your project's `go-pulse` folder and there was an error so I was unable to run the tests.
- Missing unit tests for multiple critical backend endpoints (login, register, etc)

## Integration Testing (max 12 marks)

Covers all critical integration points, APIs, and modules (3 marks)
Clearly defined steps, expected results, and preconditions. Well-structured ,detailed, and reusable (3 marks)
Thoroughly tests edge cases (boundary values, errors) (3 marks)
Tests run successfully with clear output. (3 marks)

Integration Testing Total Mark: 3 / 12

**Grader's Notes:** Missing integration tests for backend endpoints.


- If you feel like I missed something in your tests, let me know and we can discuss a regrade.

---
## Sprint Demo (Max 17 marks) 
- Attendance (max 2.5 marks)
  - 2.5 marks = full team is present
  - 0.5 mark = one member is not present
  - 0 marks = more than one member is not present

- Working software (max 8 marks)
  - 8 marks = All 2 or 3 features presented work flawlessly
  - 1 mark removed for each bug/error identified or for missing records on JIRA

- UI Presentation (max 4 marks)
  - 4 marks = UI demonstrated is visually appealing and intuitive for users
  - 2 marks = one or more errors identified by the demo TA
  - 0 marks = UI is visually unappealing

- Presentation (max 2.5 marks)
  - 2.5 marks = Overall fluency in demonstrating software, speaking, and presenting ideas and technical
details. Comfortably answers any technical questions asked by TA

Your Mark: 17 / 17

Features Demo'd:
1. Profile page implementation
  - Users can now login to their account and customize their bio
    - Name, age, weight, bio, gender can be customized.
  - Persistence has been implemented on the backend as well.
  - Planning on implementing streaks and profile picture uploads next sprint.
2. Push notifications
  - Notifications are sent to the user when they create workouts to remind them to do their workouts.
  - Notifications are sent on a scheduled basis depending on when the user's workouts are scheduled for.
    - Notifications are handled via calls to a personalized webhook which when POST'd to, sends notifications to users.
  - Planned to implement automatic calling of this endpoint through an AWS lambda function.
3. Sharable workouts
  - Can copy links to workouts and share with others to promote collaboration.

## Total Mark

83 / 100