## Running the project

You'll need the following .env.local file
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<[Clerk](https://clerk.com) public key>
CLERK_SECRET_KEY=<Clerk secret key>
SIGNING_SECRET=<Clerk signing secret>

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register

OPENAI_API_KEY=<[OpenAI](https://openai.com) key>

And the following .env file
DATABASE_URL=<database URL, I used [Neon](https://neon.tech)>

Once you have that, you should be able to run the dev server

```bash
npm run dev
```

## Screenshots

![Journal page](screenshots/journal.png)

![Journal details page](screenshots/details.png)

![Sentiment history page](screenshots/history.png)
