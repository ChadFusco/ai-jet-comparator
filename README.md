This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Production

The app has been deployed to an AWC EC2 instance [here](http://ec2-52-33-56-56.us-west-2.compute.amazonaws.com:3200/).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

A development database is required to view data. This project used Postgres with Prisma, but could be easily adapted to other databases if desired.

## Deployment

To deploy the app:
- Place the repo on your favorite server
- Rename .env_example to .env and put in your environment variables
- Get an OpenAI API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Run `npm run build`
- Run `npm run start`

## Primary Dependencies:

- Node v20
- React v18
- Tailwind CSS v3.3
- Prisma v8
- Next v14.1
- nextui v2.2

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

