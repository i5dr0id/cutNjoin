import { defineQuery } from "next-sanity";

export const homepageQuery = defineQuery(`{
  "page": *[_id == "homePage"][0],
  "settings": *[_id == "siteSettings"][0],
  "services": *[_type == "service"] | order(order asc),
  "projects": *[_type == "project" && featured] | order(order asc)[0...4],
  "clients": *[_type == "client"] | order(order asc),
  "posts": *[_type == "post"] | order(publishedAt desc)[0...3],
  "footage": *[_type == "footageAsset"] | order(featured desc, order asc)[0...4],
  "products": *[_type == "product"] | order(order asc)
}`);
