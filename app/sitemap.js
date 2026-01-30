export default function sitemap() {
  return [
    {
      url: 'https://jobweave.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://jobweave.vercel.app/login',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://jobweave.vercel.app/register',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://jobweave.vercel.app/dashboard',
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
  ]
}
