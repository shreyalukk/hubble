# 🚀 Project Report: Hubble – Next-Gen College & Campus Operating System

**Live Application URL**: [https://hubble-35ts.vercel.app/](https://hubble-35ts.vercel.app/)  
**Repository**: [shreyalukk/hubble](https://github.com/shreyalukk/hubble)  
**Date**: July 2026  

---

## 📌 Executive Summary

**Hubble** is an all-in-one, enterprise-grade Campus Operating System built to eliminate communication fragmentation, empower peer-to-peer student engagement, simplify academic administration, and solve critical real-world challenges faced by higher education institutions.

Combining dual-role authentication (Students vs. Teachers), real-time presence-aware messaging, private hub passcode security, an academic Assignment LMS, an Engineering Reference Book & PYQ Library, a verified Notice Board (featuring Hackathons and Internship Drives), a Department Timetable Portal, and a Campus Marketplace, Hubble bridges the gap between campus administration, faculty, and student life.

---

## 🔍 Problem Statement & Real-World Campus Challenges

Modern universities and engineering colleges face severe operational inefficiencies caused by fragmented tools:

1. **Fragmented Communication & Noise**:
   - Important academic notices get buried in spammy WhatsApp groups or unread email threads.
   - Offline or unverified users receiving direct messages leads to confusion and delayed responses.

2. **Scattered Study Materials & PYQs**:
   - Course notes, lab manuals, and Previous Year Questions (PYQs) are scattered across short-lived Google Drive links, lost between semesters.
   - Engineering students lack a single organized repository categorized by department (CSE, ISE, ECE, EEE, ME, CIVIL, AI & DS).

3. **Inadequate Assignment & Homework Tracking**:
   - Students frequently miss homework deadlines across multiple subjects.
   - Teachers lack a streamlined digital portal to publish assignments, receive digital file submissions, and grade work cleanly.

4. **Missed Opportunities (Hackathons & Internships)**:
   - Flagship national hackathons (e.g., Christ University's *HackChrist v4.0*), coding contests, and off-campus internship drives fail to reach interested students in time due to unorganized bulletin boards.

5. **Lack of Timetable & Room Clarity**:
   - Students struggle to locate daily lecture rooms, lab halls, and end-semester examination schedules across semesters.

6. **Wasted Educational Resources**:
   - Students spend thousands on expensive new textbooks and calculators that seniors no longer use, with no trusted platform to buy, sell, or trade locally within campus.

---

## 💡 The Solution: Hubble Campus Platform

Hubble solves these challenges through a unified, high-performance web platform designed specifically for academic environments:

```
[Hubble Platform Gateway]
   ├── Dual Role Auth & Profile Management
   ├── Real-Time Presence & Direct Messaging
   ├── Campus Hubs & Passcode Security
   ├── Academic LMS & Homework Tracker
   ├── Engineering Book & PYQ Library
   ├── Verified Campus Notice Board
   ├── Department Class & Exam Timetables
   └── Campus Peer-to-Peer Marketplace
```

---

## 🛠️ Complete Technology Stack Architecture

Hubble is constructed using a modern, scalable, serverless stack designed for lightning-fast responsiveness and real-time synchronization:

| Layer | Technology | Key Capabilities & Purpose |
| :--- | :--- | :--- |
| **Core Framework** | **Next.js 16 (App Router)** | Full-stack React framework utilizing Server Components for optimal SEO, speed, and serverless API routing. |
| **Language** | **TypeScript 5.x** | End-to-end type safety, preventing runtime errors across client components and server actions. |
| **Styling & Design System** | **Tailwind CSS & Vanilla CSS** | Custom responsive UI design system with modern aesthetic cards, micro-animations, and warm dark/light modes. |
| **Icons & Micro-UI** | **Lucide React** | Rich, accessible micro-icons for intuitive navigation across all campus modules. |
| **Backend & Database** | **Supabase (PostgreSQL)** | Managed PostgreSQL database storing users, hubs, messages, assignments, resources, and notices. |
| **Real-Time Engine** | **Supabase Realtime & Presence** | WebSocket presence engine tracking active logged-in users and real-time message deletion broadcast. |
| **Security & Auth** | **Supabase Auth + Row-Level Security (RLS)** | Dual-role authentication with strict PostgreSQL policies isolating data between users, students, and faculty. |
| **Deployment & CI/CD** | **Vercel Platform** | Automated global edge deployment, instant git-push CI/CD pipelines, and zero-downtime serverless hosting. |

---

## 🌟 Key Modules & Functional Capabilities

### 1. 🎓 Dual Role Authentication & Onboarding
- **Student Flow**: Captures Department, Year of Study (1st - 4th/Integrated), and Topics of Interest.
- **Teacher Flow**: Captures Department, Teaching Experience, and Subjects Taught.
- Custom onboarding interface persisting role metadata directly into Supabase user profiles.

### 2. 🟢 Real-Time Presence & Message Guarding
- Restricts direct messaging strictly to users currently logged into the website.
- Live online status indicators (🟢 **Logged In** / ⚪ **Offline**) across direct messages, member lists, and conversation headers.
- Real-time `DELETE` policy allowing users to delete sent messages instantly across all connected devices.

### 3. 🔑 Hub Privacy & Passcode Security
- **Auto-Generated Join Codes**: Creating a private hub instantly generates a code (e.g., `HUB-8F3A29`).
- **Custom Creator Passcode**: Hub creators can set a passcode of their choice (e.g., `MYSECRET123`).
- **Join with Passcode Modal**: Enables instant passcode-based membership registration.

### 4. 📝 Campus Assignments LMS ([/assignments](https://hubble-35ts.vercel.app/assignments))
- **Teacher Mode**: Publish homework with title, instructions, max points, due date, and group association.
- **Student Mode**: View deadline countdowns, submit Google Drive/file links, and view graded feedback.

### 5. 📚 Engineering Books & PYQ Library ([/resources](https://hubble-35ts.vercel.app/resources))
- **Department Selector**: Filter study materials for **CSE**, **ISE**, **ECE**, **EEE**, **ME**, **CIVIL**, and **AI & DS**.
- Pre-populated reference textbooks (*Silberschatz*, *Horowitz & Sahni*, *Sedra & Smith*, *B.S. Grewal*, *P.K. Nag*) and Previous Year Question papers.

### 6. 📢 Verified Notice Board & Hackathon Circulars ([/announcements](https://hubble-35ts.vercel.app/announcements))
- Pre-loaded with flagship event circulars: **Christ University HackChrist v4.0 (₹1,50,000 prize pool)**, National Coding Championship, and Software Engineering Internship drives (₹45,000/month stipend).
- Pinning feature for urgent administrative circulars.

### 7. 📅 Class & Examination Timetable Portal ([/timetable](https://hubble-35ts.vercel.app/timetable))
- Weekly lecture schedules with time slots, classroom/lab hall numbers (`CS-301`, `Lab 4`), and faculty names.
- End-Semester examination schedule per department and semester.

### 8. 🛍️ Campus Peer-to-Peer Marketplace ([/marketplace](https://hubble-35ts.vercel.app/marketplace))
- Peer-to-peer campus marketplace for buying, selling, or trading used textbooks, lab coats, calculators, and tech items.

---

## 🗄️ Database Architecture & Schemas

The underlying Supabase PostgreSQL database consists of relational tables configured with Row-Level Security:

- `users`: Stores `id`, `full_name`, `avatar_url`, `role` (`student`, `teacher`, `admin`), `department`, `college_id`.
- `hubs` & `hub_members`: Stores group metadata, privacy mode (`public`, `private`, `passcode_protected`), `passcode`, and memberships.
- `direct_messages`: Stores direct chat records with `sender_id`, `receiver_id`, content, and timestamp.
- `assignments` & `submissions`: Stores assignment details, deadlines, student file submissions, and points.
- `resources`: Stores reference books, PYQs, file URLs, and associated engineering department tags.
- `announcements`: Stores official notices, categories (`hackathons & contests`, `internships & hiring`, `exams & timetables`), and pinning status.

---

## 🚀 Live Access & Verification

- **Live URL**: [https://hubble-35ts.vercel.app/](https://hubble-35ts.vercel.app/)
- **Platform Status**: Fully Operational, Deployed & Ready for Campus Use.
