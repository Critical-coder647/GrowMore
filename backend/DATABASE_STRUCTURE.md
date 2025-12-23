# Database Structure Changes

## Overview
The database has been restructured to separate user data by role and add community interaction tracking.

## Collections

### 1. StartupUser Collection
**Purpose:** Stores all startup/founder user data  
**Collection Name:** `startupusers`

**Fields:**
- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password
- `role`: 'startup' (default)
- `companyName`: Name of the startup
- `industry`: Array of industries
- `stage`: Funding stage (Seed, Series A, etc.)
- `fundingRequirement`: Min and max funding needed
- `traction`: Current traction metrics
- `description`: Company description
- `pitchDeckUrl`: Link to pitch deck
- `logoUrl`: Company logo URL
- `keywords`: Array of relevant keywords
- `location`: Geographic location
- `founders`: Array of founder names
- `website`: Company website
- `pastActivity`: Array of past activities
- `timestamps`: Created and updated timestamps

### 2. InvestorUser Collection
**Purpose:** Stores all investor user data  
**Collection Name:** `investorusers`

**Fields:**
- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password
- `role`: 'investor' (default)
- `firmName`: Investment firm name
- `investmentBudget`: Min and max investment range
- `industriesInterestedIn`: Array of target industries
- `stagePreferences`: Array of preferred funding stages
- `location`: Geographic location
- `keywords`: Array of relevant keywords
- `interests`: Array of investment interests
- `portfolioCompanies`: Array of portfolio company names
- `pastActivity`: Array of past activities
- `checkSize`: Typical investment check size
- `thesis`: Investment thesis/strategy
- `timestamps`: Created and updated timestamps

### 3. CommunityInteraction Collection
**Purpose:** Stores all community page interactions (posts, comments, likes, etc.)  
**Collection Name:** `communityinteractions`

**Fields:**
- `userId`: Reference to user (StartupUser or InvestorUser)
- `userType`: Model reference ('StartupUser' or 'InvestorUser')
- `userName`: Display name of user
- `userRole`: User's role ('startup' or 'investor')
- `interactionType`: Type of interaction ('post', 'comment', 'like', 'share', 'message', 'connection_request')
- `content`: Text content of the interaction
- `postId`: Reference to parent post (for comments)
- `media`: Array of media attachments
  - `type`: 'image', 'video', or 'document'
  - `url`: Media URL
- `likes`: Array of like objects
  - `userId`: User who liked
  - `userType`: Model reference
  - `timestamp`: When liked
- `comments`: Array of comment objects
  - `userId`: Comment author
  - `userType`: Model reference
  - `userName`: Commenter name
  - `content`: Comment text
  - `timestamp`: When commented
- `tags`: Array of hashtags/topics
- `visibility`: 'public', 'connections', or 'private'
- `isActive`: Boolean for soft delete
- `timestamps`: Created and updated timestamps

**Indexes:**
- `userId` + `createdAt`: For user feed queries
- `interactionType` + `createdAt`: For filtering by type
- `tags`: For tag-based search

### 4. User Collection (Legacy)
**Purpose:** Stores admin or other role users  
**Collection Name:** `users`

This collection remains for backward compatibility and admin users.

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user (auto-routes to correct collection)
- `POST /login` - Login user (searches all collections)
- `GET /me` - Get current user profile (protected)

### Community Routes (`/api/community`)
- `POST /posts` - Create a new post
- `GET /posts` - Get all posts (paginated feed)
- `GET /posts/:id` - Get single post
- `POST /posts/:id/like` - Like/unlike a post
- `POST /posts/:id/comments` - Add comment to post
- `GET /users/:userId/posts` - Get user's posts
- `DELETE /posts/:id` - Soft delete a post
- `GET /posts/search/tags?tags=tag1,tag2` - Search posts by tags

## Migration Notes

### For Existing Users
- Existing users in the `users` collection will continue to work
- New registrations will be automatically routed to the appropriate collection
- Login works across all collections

### Benefits
1. **Better Organization**: User data is separated by role
2. **Optimized Queries**: Faster queries on role-specific data
3. **Scalability**: Easier to scale collections independently
4. **Community Features**: Full support for social interactions
5. **Flexibility**: Easy to add role-specific fields without affecting other roles

## Example Usage

### Register a Startup
```javascript
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@startup.com",
  "password": "securepass123",
  "role": "startup"
}
```

### Register an Investor
```javascript
POST /api/auth/register
{
  "name": "Jane Smith",
  "email": "jane@vc.com",
  "password": "securepass123",
  "role": "investor"
}
```

### Create a Community Post
```javascript
POST /api/community/posts
Headers: { Authorization: "Bearer <token>" }
{
  "content": "Excited to announce our Series A funding!",
  "tags": ["funding", "series-a", "startup"],
  "visibility": "public"
}
```

### Like a Post
```javascript
POST /api/community/posts/:postId/like
Headers: { Authorization: "Bearer <token>" }
```

### Comment on a Post
```javascript
POST /api/community/posts/:postId/comments
Headers: { Authorization: "Bearer <token>" }
{
  "content": "Congratulations on the funding!"
}
```
