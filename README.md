<REAL-TIME CHAT SYSTEM>
A WebSocket-based chat system supporting private messaging and group chats with messages.

<Features:>
1.User managment
-Real-time user connection and disconnection
-Unique username
-Online users list
-Stored all users in database


2.Fatures message
-Support Private & Group
-Send message with users 
-Update status is_read if user fetch messages
-Timestamp for all messages
-Stored all messages in database
-Real time read messages
-Fetch last 20 messages in chat

3.Group Chat
-Create new groups
-Join existing groups


<Technology Stack>
Backend: Node.js with Express.js
WebSocket: ws library
Database: SQLite3
API: RESTful endpoints

Database Schema
1-User Table (id,username)
2-Message Table (id,sender,receiver ,group_name,timestamp)
3-Group Table (id,group_name)
4-group member (id,group_name,username)




<Installation>
1-Install dependencies:
npm install

2-Start the server:
npm run server

The server will start on port 5001 by default.

<API Endpoints>
1-Private Messages
GET /messages/private/:username
Get user's private messages
Messages are marked as read when fetching
Returns last 20 messages

2-Group Messages
GET /messages/group/:groupName
Get group messages
Messages are marked as read when fetching
Returns last 20 messages

3-User Management
GET /users
List all registered users


4-Group Management
GET /groups
List all available groups


