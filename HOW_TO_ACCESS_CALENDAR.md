# How to Access the Calendar and Add Tasks

## Step-by-Step Guide

### 1. Open the Website
- Go to: **http://localhost:3000**
- You should see the StudyGroups homepage

### 2. Login or Register
- If not logged in, click **"Login"** in the top right
- Enter your credentials or create a new account
- After login, you'll be redirected to the groups page

### 3. Join or Create a Group
You have two options:

**Option A: Join an Existing Group**
- Browse the list of available groups
- Click **"Join Group"** on any group card
- Then click **"View Details"** to enter the group

**Option B: Create Your Own Group**
- Click **"Create Group"** button (top right or in hero section)
- Fill in:
  - Group name (e.g., "Python Study Group")
  - Description (e.g., "Learning Python together")
  - Maximum members (default: 50)
- Click **"Create Group"**
- You'll be automatically taken to your new group

### 4. Access the Tabs
Once inside a group, you'll see **4 tabs** at the top:
- 📋 **Tasks** - List view of all tasks
- 📅 **Calendar** - Monthly calendar view ← THIS IS THE CALENDAR
- 🏆 **Leaderboard** - Member rankings
- 👥 **Members** - Group member list

### 5. Add a Task
**From the Tasks Tab:**
1. Click on the **"📋 Tasks"** tab
2. Click the **"+ Add Task"** button (top right)
3. A form will appear with fields:
   - **Task title** (e.g., "Complete Chapter 3")
   - **Task description** (e.g., "Read and summarize chapter 3")
   - **Due date** (select from calendar picker)
   - **Points** (1-100, default: 10)
4. Click **"Create Task"**
5. The task will appear in the list

### 6. View Calendar
1. Click on the **"📅 Calendar"** tab
2. You'll see a monthly calendar view
3. Tasks appear as colored badges on their due dates:
   - **Blue badges** = Pending tasks
   - **Green badges** = Completed tasks
4. Click on any task badge to see details
5. Use **"← Previous"** and **"Next →"** buttons to navigate months

### 7. Interact with Tasks on Calendar
- **Click a task badge** → Opens task details modal
- **In the modal:**
  - View full task information
  - Click **"Mark Complete"** to complete the task
  - Click **"Mark Incomplete"** to undo completion
  - Click **✕** or outside modal to close

## Troubleshooting

### "I don't see the Calendar tab"
**Possible reasons:**
1. ✗ You're not logged in → Login first
2. ✗ You're not a member of the group → Join the group
3. ✗ You're on the groups list page → Click "View Details" on a group
4. ✗ Page didn't load properly → Refresh the page (F5)

### "I don't see the Add Task button"
**Possible reasons:**
1. ✗ You're not on the Tasks tab → Click "📋 Tasks" tab
2. ✗ You're not a member → Join the group first
3. ✗ Button is at the top right of the Tasks section → Scroll up

### "Calendar is empty"
**This is normal if:**
- No tasks have been created yet
- All tasks are in different months (use navigation buttons)
- Tasks were deleted

**Solution:** Create some tasks first, then view the calendar

### "Can't create tasks"
**Check:**
1. Are you logged in?
2. Are you a member of the group?
3. Did you fill all required fields?
4. Is the due date within the next 31 days?

## Visual Guide

```
Homepage (/)
    ↓
Login (/login)
    ↓
Groups List (/groups)
    ↓ [Click "View Details" on a group]
    ↓
Group Detail Page (/groups/:id)
    ↓
    ├─ 📋 Tasks Tab ← Add tasks here
    ├─ 📅 Calendar Tab ← View calendar here
    ├─ 🏆 Leaderboard Tab
    └─ 👥 Members Tab
```

## Quick Test

To quickly test the calendar:

1. **Create a test group:**
   - Name: "Test Group"
   - Description: "Testing calendar"
   - Click Create

2. **Add 3 tasks with different dates:**
   - Task 1: "Task A" - Due today
   - Task 2: "Task B" - Due in 3 days
   - Task 3: "Task C" - Due in 7 days

3. **View calendar:**
   - Click "📅 Calendar" tab
   - You should see 3 colored badges on different dates

4. **Test interaction:**
   - Click on a task badge
   - Modal should open with task details
   - Click "Mark Complete"
   - Badge should turn green

## Features Summary

### Tasks Tab Features:
- ✅ List view of all tasks
- ✅ Add new tasks
- ✅ Mark tasks complete/incomplete
- ✅ Delete tasks (admin/creator only)
- ✅ See task details (title, description, due date, points)
- ✅ Visual status (pending/completed/overdue)

### Calendar Tab Features:
- ✅ Monthly calendar view
- ✅ Navigate between months
- ✅ Tasks shown on due dates
- ✅ Color-coded status (blue=pending, green=completed)
- ✅ Click task to see details
- ✅ Quick complete/uncomplete from modal
- ✅ Today highlighted
- ✅ Legend showing color meanings

## Still Having Issues?

If you still can't see the calendar or add tasks:

1. **Check browser console:**
   - Press F12
   - Look for any red error messages
   - Share the errors if you see any

2. **Verify servers are running:**
   - Backend should be on port 5000
   - Frontend should be on port 3000

3. **Try refreshing:**
   - Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
   - Clear browser cache if needed

4. **Check network tab:**
   - Press F12 → Network tab
   - Look for failed API requests (red)
   - Verify API calls to /api/groups and /api/tasks

## Expected Behavior

When everything is working correctly:

1. ✅ You can login successfully
2. ✅ You can see groups list
3. ✅ You can join/create groups
4. ✅ Inside a group, you see 4 tabs
5. ✅ Calendar tab shows a monthly calendar
6. ✅ Tasks tab has "+ Add Task" button
7. ✅ You can create tasks with due dates
8. ✅ Tasks appear on calendar on their due dates
9. ✅ Clicking tasks opens a modal
10. ✅ You can complete/uncomplete tasks

If all these work, the feature is functioning correctly!
