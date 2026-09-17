import { defineQuery } from "next-sanity";

export const homepageQuery = defineQuery(`{
  "page": *[_type == "homePage" && _id == "homePage"][0]{
    heroEyebrow, heroHeadline, heroHighlight, heroIntro, heroPrimaryCta, heroSecondaryCta,
    heroImage, heroVideoUrl, stats,
    services, servicesCta,
    projects,
    clientsHeading,
    updates, updatesReadMore,
    footage, footageDownload,
    merch,
    contact, contactIntro, contactFormHeading, contactSubmit, contactImage
  },
  "services": *[_type == "service"] | order(order asc){ _id, title, tag, timecode, description },
  "projects": *[_type == "project" && featured == true] | order(order asc)[0...4]{
    _id, title, category, timecode, still, videoUrl
  },
  "clients": *[_type == "client"] | order(order asc){
    _id, name, url, logoHeight,
    logo{ ..., "dimensions": asset->metadata.dimensions{ width, height } }
  },
  "posts": *[_type == "post"] | order(publishedAt desc)[0...3]{
    _id, title, "slug": slug.current, category, publishedAt, cover, excerpt
  },
  "footage": *[_type == "footageAsset"] | order(featured desc, order asc)[0...4]{
    _id, title, kind, location, duration, fps, resolution, poster, featured,
    "hasDownload": defined(original.key),
    "previewUrl": preview.url
  },
  "products": *[_type == "product"] | order(order asc)[0...2]{
    _id, name, garment, price, "slug": slug.current, front, back, available
  }
}`);

export const seoQuery = defineQuery(`*[_type == "homePage" && _id == "homePage"][0]{
  seoTitle, seoDescription, shareImage, heroImage, heroIntro, heroHeadline, heroHighlight
}`);

export const licenceQuery = defineQuery(`*[_type == "siteSettings" && _id == "siteSettings"][0]{
  footageLicenceSummary, footageLicence
}`);

export const footageLibraryQuery = defineQuery(`{
  "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{
    footageHeading, footageIntro, footageLicenceSummary
  },
  "hero": *[_type == "footageAsset" && defined(poster.asset)] | order(featured desc, order asc)[0]{ poster },
  "total": count(*[
    _type == "footageAsset" && defined(poster.asset)
    && ($type == "all" || ($type == "drone" && drone == true) || kind == $type)
    && ($search == "" || title match $search || location match $search || count(tags[@ match $search]) > 0)
  ]),
  "items": *[
    _type == "footageAsset" && defined(poster.asset)
    && ($type == "all" || ($type == "drone" && drone == true) || kind == $type)
    && ($search == "" || title match $search || location match $search || count(tags[@ match $search]) > 0)
  ] | order(featured desc, order asc, _createdAt desc)[$start...$end]{
    _id, title, kind, location, duration, fps, resolution,
    poster{ ..., "dimensions": asset->metadata.dimensions{ width, height } },
    "hasDownload": defined(original.key),
    "previewUrl": preview.url
  }
}`);

export const storeStatusQuery = defineQuery(`*[_id == "storeSettings"][0]{ open }`);

export const storeQuery = defineQuery(`{
  "settings": *[_id == "storeSettings"][0]{ open, heading, intro },
  "products": *[_type == "product"] | order(order asc){
    _id, name, "slug": slug.current, collection, subtitle, garment, price, available, front, back,
    "inStock": count(variants[stock > 0]) > 0
  }
}`);

export const productQuery = defineQuery(`{
  "settings": *[_id == "storeSettings"][0]{ open },
  "product": *[_type == "product" && slug.current == $slug][0]{
    _id, name, "slug": slug.current, collection, subtitle, garment, tagline, price, available, description,
    front, back, variants[]{ _key, size, stock }
  }
}`);

export const productSlugsQuery = defineQuery(`*[_type == "product" && defined(slug.current)].slug.current`);

export const checkoutQuery = defineQuery(`*[_id == "storeSettings"][0]{
  open, nigeriaRates[]{ state, fee, eta }, internationalZones[]{ name, countries, fee, eta }, restOfWorldFee, restOfWorldEta
}`);

export const returnsQuery = defineQuery(`*[_id == "storeSettings"][0]{ returnsPolicy }`);

export const footageTitleQuery = defineQuery(
  `*[_type == "footageAsset" && _id == $id][0]{ _id, title, kind }`,
);

export const siteQuery = defineQuery(`{
  "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{
    email, phone, address, addressShort, location, hoursSummary, hours, socials, footerBlurb, copyrightName,
    footageLicenceSummary
  },
  "services": *[_type == "service"] | order(order asc){ _id, title }
}`);
