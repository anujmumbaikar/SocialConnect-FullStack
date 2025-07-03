# SocialConnect

SocialConnect is a modern and scalable social media app built using Next.js, MongoDB, NextAuth, and ImageKit. Users can upload posts and reels, interact with others, explore trending content, and manage social profiles with a clean UI powered by ShadCN.

---

## 🔧 Tech Stack
- Next.js — React framework for SSR & API routes
- MongoDB — NoSQL database with Aggregation Pipelines
- NextAuth — Auth with Google OAuth & email/password
- ImageKit — CDN and media upload/optimization
- Tailwind CSS + ShadCN — UI/UX and component styling

---

## 🌟 Features

### ✅ Available
- Google & Email-based user authentication
- Email verification for credential-based accounts
- Upload posts and reels with captions
- View reels and posts from self and others
- Like and save posts/reels
- Explore tab to discover trending content
- View user profiles (own and others)
- Show likes, followers, following, and post counts

### 🚧 Coming Soon
- Commenting on posts/reels
- Real-time chat system
- 24-hour Stories (like Instagram)
- Follow/unfollow users and notification system
---

## MongoDB Aggregation Pipelines
I use MongoDB Aggregation Pipelines for better performance and scalability across user interactions (likes, saves, followers, etc.).

### Why?
Instead of storing likes directly inside the post document, which leads to array updates and performance issues, we moved such data into separate collections and join them efficiently using aggregation.

### For Example:
> "Instead of saving likes into the same posts table, even if a single person again dislikes, then the whole array sorting would be expensive."
> I apply this same strategy for:
> Followers / Following
> Comments
---

## Environment Variables
```bash
# MongoDB
MONGODB_URI=
# NextAuth
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
# Gmail (Nodemailer)
EMAIL_USER=
EMAIL_PASS=
# ImageKit
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

---

## Getting Started
```bash
git clone https://github.com/your-username/socialconnect.git
cd socialconnect
npm install
npm run dev
```






