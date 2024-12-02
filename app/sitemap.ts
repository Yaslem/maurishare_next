import type { MetadataRoute } from 'next'
import db from '@/app/helpers/db'

const STATIC_ROUTES = [
    {
      path: '/',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1
    },
    {
      path: '/about',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      path: '/auth/signin',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      path: '/auth/signup',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      path: '/post/create',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8
    },
];
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    const articles = await db.post.findMany({
        where: {
          isPublished: true
        },
        select: {
          slug: true,
          updatedAt: true
        }
      });
    
      const users = await db.user.findMany({
        select: {
          username: true,
          updatedAt: true
        }
      });
    
      const dynamicRoutes = articles.map(article => ({
        path: `/post/${article.slug}`,
        lastmod: article.updatedAt.toISOString(),
        changefreq: 'weekly',
        priority: 0.7
      }));
    
      const usersRoutes = users.map(user => ({
        path: `/user/${user.username}`,
        lastmod: user.updatedAt.toISOString(),
        changefreq: 'weekly',
        priority: 0.7
      }));
    
      const allRoutes = [...STATIC_ROUTES, ...dynamicRoutes, ...usersRoutes];

  return allRoutes.map(route => ({
    url: `${process.env.BASE_URL}${route.path}`,
    lastModified: route.lastmod,
    changeFrequency: route.changefreq,
    priority: route.priority
  }));
}