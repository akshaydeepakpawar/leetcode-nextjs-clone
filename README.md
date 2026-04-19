# leetcode-nextjs-clone 🚀

## LeetCode Clone Built with Next.js and Modern Web Technologies

This project is a sophisticated clone of the popular online judge platform LeetCode, meticulously engineered using Next.js 14 and a suite of cutting-edge web technologies. It provides a platform for users to practice coding problems, submit solutions, and track their progress, complete with administrative functionalities for problem management.

## ✨ Key Features & Benefits

*   **Interactive Problem Solving:** Browse a collection of coding problems and write solutions directly within the platform.
*   **Robust Code Judging System:** Integrated with Judge0 API for real-time compilation and execution of submitted code against test cases.
*   **Comprehensive User Authentication:** Secure sign-up and sign-in flows powered by Clerk for managing user accounts.
*   **Admin Problem Management:** Dedicated tools for administrators to create, edit, and manage coding problems, including test cases and language configurations.
*   **Personalized User Profiles:** Users can view their submission history, track progress, and manage personal information.
*   **Problem Playlists:** Organize and manage problems into custom playlists for focused practice.
*   **Modern Web Stack:** Leverages the power of Next.js 14 (App Router), TypeScript, Prisma ORM, and more for a scalable and maintainable application.
*   **Developer-Friendly:** Designed with modularity and best practices in mind, making it easy for contributors to understand and extend.

## 🛠️ Prerequisites & Dependencies

Before you begin, ensure you have the following installed:

*   **Node.js**: v18.x or later (LTS recommended)
*   **npm**, **yarn**, **pnpm**, or **bun**: A package manager for JavaScript.
*   **Docker**: Required if you plan to self-host the Judge0 API. Otherwise, an external Judge0 API endpoint is needed.
*   **Git**: For cloning the repository.
*   **Database**: A PostgreSQL, MySQL, SQLite, or SQL Server database (Prisma supports various databases).

## 📦 Installation & Setup Instructions

Follow these steps to get your development environment up and running:

### 1. Clone the Repository

```bash
git clone https://github.com/akshaydeepakpawar/leetcode-nextjs-clone.git
cd leetcode-nextjs-clone
```

### 2. Install Dependencies

Using your preferred package manager:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the project and populate it with the necessary environment variables.

```ini
# Database Configuration
DATABASE_URL="YOUR_DATABASE_CONNECTION_STRING" # e.g., postgresql://user:password@host:port/database

# Clerk Authentication (Sign up at https://clerk.com/ for keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="YOUR_CLERK_PUBLISHABLE_KEY"
CLERK_SECRET_KEY="YOUR_CLERK_SECRET_KEY"
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Judge0 API (You can use a hosted solution or self-host with Docker)
JUDGE0_API_URL="YOUR_JUDGE0_API_ENDPOINT" # e.g., http://localhost:2358
JUDGE0_API_KEY="YOUR_JUDGE0_RAPIDAPI_KEY_IF_APPLICABLE" # Not always needed if self-hosting
```

**Note on Judge0:**
If you're self-hosting Judge0, refer to the [Judge0 documentation](https://github.com/judge0/judge0) for setting it up using Docker. Ensure your `JUDGE0_API_URL` points to your running Judge0 instance.

### 4. Database Setup

This project uses Prisma as its ORM. You'll need to generate the Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init # 'init' can be any descriptive name for your migration
```

### 5. Start the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The page auto-updates as you edit the files.

## 🚀 Usage Examples & API Documentation

### User Flow
1.  **Sign Up / Sign In:** Navigate to `/sign-up` or `/sign-in` to create an account or log in.
2.  **Browse Problems:** After logging in, visit the `/problems` page to view available coding challenges.
3.  **Solve Problems:** Select a problem, write your code, and submit it for evaluation.
4.  **View Profile:** Check your `/profile` to see your submission history and performance.

### API Endpoints
The project exposes several API endpoints for interaction:

*   **`/api/create-problem` (POST):**
    *   **Description:** Allows administrators to create new coding problems.
    *   **Authentication:** Requires `ADMIN` user role.
    *   **Functionality:** Submits problem details and test cases to the database and potentially configures Judge0.
*   **`/api/playlists/add-problem` (POST):**
    *   **Description:** Enables authenticated users to add problems to their custom playlists.
    *   **Authentication:** Requires authenticated user.
    *   **Functionality:** Links a problem to a user's playlist.

Further API documentation, including request/response schemas, will be added as the project matures. For now, refer to the source code in the `app/api/` directory.

## ⚙️ Configuration Options

The core configuration for the application is managed via environment variables.

| Variable                              | Description                                                                                             | Example                                    |
| :-------------------------------------|-------------------------------------------------------------------------------------------------------- | :----------------------------------------- |
| `DATABASE_URL`                        | Connection string for your database (e.g., PostgreSQL, MySQL).                                          | `postgresql://user:pass@host:5432/db`      |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`   | Your public key from Clerk for client-side authentication.                                              | `pk_live_XXXXXXXXXXXXXXXXXXXXX`            |
| `CLERK_SECRET_KEY`                    | Your secret key from Clerk for server-side authentication.                                              | `sk_live_XXXXXXXXXXXXXXXXXXXXX`            |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`       | The path to your sign-in page.                                                                          | `/sign-in`                                 |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`       | The path to your sign-up page.                                                                          | `/sign-up`                                 |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | The URL to redirect to after a successful sign-in.                                                      | `/`                                        |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | The URL to redirect to after a successful sign-up.                                                      | `/`                                        |
| `JUDGE0_API_URL`                      | The base URL for the Judge0 API endpoint.                                                               | `http://localhost:2358` or `https://api.judge0.com`|
| `JUDGE0_API_KEY`                      | (Optional) API key for Judge0 if using a commercial or RapidAPI instance. Not typically needed for self-hosted. | `YOUR_RAPIDAPI_KEY`                        |

## 🤝 Contributing Guidelines

We welcome contributions to the `leetcode-nextjs-clone` project! If you're interested in helping out, please follow these guidelines:

1.  **Fork the repository** and create your branch from `main`.
2.  **Ensure code quality:** Write clean, well-commented, and maintainable code.
3.  **Follow conventional commits:** Use a consistent commit message format.
4.  **Test your changes:** Add or update tests as appropriate.
5.  **Submit a Pull Request:** Provide a clear description of your changes.

**Note on AI Agents:**
This project contains `AGENTS.md` and `CLAUDE.md`, which are internal notes related to potential AI assistance during development. While not direct contribution guidelines, they offer insights into the project's development context. Contributors are encouraged to develop solutions independently and follow standard software development practices.

## 📄 License Information

This project currently does not have a specified license. Users are advised to contact the repository owner `akshaydeepakpawar` for licensing inquiries. It is highly recommended to add a license file (e.g., MIT, Apache 2.0) to clarify terms of use and contribution.

## 🙏 Acknowledgments

*   Built with [Next.js](https://nextjs.org), bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
*   Authentication powered by [Clerk](https://clerk.com).
*   Code execution and judging provided by [Judge0](https://judge0.com).
*   Database interaction handled by [Prisma ORM](https://www.prisma.io/).
*   Special thanks to the open-source community for providing invaluable tools and libraries.
