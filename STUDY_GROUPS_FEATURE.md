# Study Groups Feature Documentation

## Overview
The Study Groups feature enables students to create collaborative learning groups, schedule tasks up to a month in advance, and compete with each other by completing scheduled tasks. Members earn points for completing tasks, and a leaderboard tracks everyone's progress.

## Features

### 1. Group Management
- **Create Groups**: Users can create study groups with a name, description, optional topic association, and member limit
- **Join Groups**: Public groups can be joined by any user
- **Leave Groups**: Members can leave groups (except the creator)
- **Member Roles**: Groups have admins (creator) and regular members

### 2. Task Scheduling
- **Create Tasks**: Any group member can create tasks with:
  - Title and description
  - Due date (up to 31 days in the future)
  - Point value (1-100 points)
- **Task Management**: Admins and task creators can delete tasks
- **Task Completion**: Members can mark tasks as complete or incomplete
- **Task Status**: Visual indicators for completed and overdue tasks

### 3. Competition & Leaderboard
- **Points System**: Members earn points by completing tasks
- **Leaderboard**: Real-time ranking of all group members by points
- **Statistics**: Track tasks completed and total points earned
- **Medals**: Top 3 members get special visual recognition (🥇🥈🥉)

### 4. Group Features
- **Topic Association**: Groups can be linked to specific topics
- **Member Limit**: Configurable maximum members (2-100)
- **Public Groups**: All groups are public and discoverable
- **Member List**: View all group members and their join dates

## API Endpoints

### Groups
- `POST /api/groups` - Create a new group
- `GET /api/groups` - Get all public groups
- `GET /api/groups/my-groups` - Get user's groups (requires auth)
- `GET /api/groups/:id` - Get single group details
- `POST /api/groups/:id/join` - Join a group (requires auth)
- `POST /api/groups/:id/leave` - Leave a group (requires auth)
- `GET /api/groups/:id/leaderboard` - Get group leaderboard

### Tasks
- `POST /api/tasks` - Create a new task (requires auth)
- `GET /api/tasks/group/:groupId` - Get all tasks for a group
- `POST /api/tasks/:id/complete` - Mark task as complete (requires auth)
- `POST /api/tasks/:id/uncomplete` - Mark task as incomplete (requires auth)
- `DELETE /api/tasks/:id` - Delete a task (requires auth, admin or creator only)

## Database Models

### Group Model
```javascript
{
  name: String (required),
  description: String (required),
  creatorId: ObjectId (User),
  members: [{
    userId: ObjectId (User),
    joinedAt: Date,
    role: 'admin' | 'member'
  }],
  topicId: ObjectId (Topic, optional),
  isPublic: Boolean (default: true),
  maxMembers: Number (default: 50),
  timestamps: true
}
```

### Task Model
```javascript
{
  groupId: ObjectId (Group, required),
  title: String (required),
  description: String (required),
  dueDate: Date (required),
  createdBy: ObjectId (User),
  completions: [{
    userId: ObjectId (User),
    completedAt: Date,
    notes: String
  }],
  points: Number (default: 10),
  timestamps: true
}
```

## Frontend Pages

### 1. Group List (`/groups`)
- View all public groups
- Tab to view "My Groups"
- Join groups directly from the list
- Create new group button
- Shows member count and creator info

### 2. Create Group (`/create-group`)
- Form to create a new study group
- Fields: name, description, topic (optional), max members
- Redirects to group detail page after creation

### 3. Group Detail (`/groups/:id`)
Three tabs:
- **Tasks Tab**: View, create, and manage tasks
- **Leaderboard Tab**: See member rankings and points
- **Members Tab**: View all group members

## User Flow

1. **Discover Groups**: Browse available groups on `/groups`
2. **Join Group**: Click "Join Group" to become a member
3. **View Tasks**: See all scheduled tasks in the group
4. **Complete Tasks**: Mark tasks as complete to earn points
5. **Track Progress**: Check leaderboard to see rankings
6. **Create Tasks**: Add new tasks for the group to complete
7. **Compete**: Earn more points than other members to rank higher

## Design Features

### Visual Elements
- Light theme with purple gradient accents (#667eea to #764ba2)
- Card-based layout for groups and tasks
- Hover effects and smooth transitions
- Color-coded task status (blue: pending, green: completed, red: overdue)
- Medal emojis for top 3 leaderboard positions
- Gradient backgrounds for top 3 leaderboard entries

### Responsive Design
- Grid layout for group cards
- Flexible task and leaderboard lists
- Mobile-friendly forms and buttons

## Security & Permissions

- **Authentication Required**: Creating groups, joining groups, managing tasks
- **Member-Only Access**: Only group members can view tasks and leaderboard
- **Admin Privileges**: Group creator is automatically admin
- **Task Deletion**: Only admins and task creators can delete tasks
- **Creator Protection**: Group creator cannot leave the group

## Future Enhancements (Potential)
- Private groups with invite codes
- Task categories and filters
- Group chat or discussion board
- Weekly/monthly challenges
- Achievement badges
- Task reminders and notifications
- Group analytics and insights
- Export leaderboard data

## Technical Implementation

### Backend
- Express.js routes and controllers
- MongoDB models with Mongoose
- JWT authentication middleware
- Input validation with express-validator
- Indexed queries for performance

### Frontend
- React functional components with hooks
- React Router for navigation
- Axios for API calls
- Context API for authentication
- CSS modules for styling

## Testing the Feature

1. Start both servers (backend and frontend)
2. Login or create an account
3. Navigate to "Groups" in the navbar
4. Create a new study group
5. Add tasks with different due dates
6. Mark some tasks as complete
7. Check the leaderboard to see your points
8. Invite friends to join and compete!

## Notes
- Tasks can be scheduled up to 31 days in advance
- Points are awarded immediately upon task completion
- Leaderboard updates in real-time
- All groups are currently public (private groups can be added later)
- Maximum 100 members per group (configurable)
