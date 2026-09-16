import { defineQuery } from "next-sanity";

export const homepageQuery = defineQuery(`{
  "settings": *[_type == "siteSettings"][0],
  "services": *[_type == "service"] | order(order asc),
  "projects": *[_type == "project"] | order(order asc)[0...4],
  "clients": *[_type == "client"] | order(order asc),
  "posts": *[_type == "post"] | order(publishedAt desc)[0...3],
  "footage": *[_type == "footageAsset"] | order(featured desc, _createdAt desc)[0...4],
  "products": *[_type == "product"] | order(order asc)
}`);
