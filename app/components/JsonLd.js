export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://jobweave.vercel.app/#website",
        "url": "https://jobweave.vercel.app",
        "name": "Job Weave",
        "description": "The ultimate free tool for job seekers to track applications and manage assets.",
        "publisher": {
          "@id": "https://jobweave.vercel.app/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://jobweave.vercel.app/?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://jobweave.vercel.app/#organization",
        "name": "The Closure Studio",
        "url": "https://jobweave.vercel.app",
        "logo": {
          "@type": "ImageObject",
          "url": "https://jobweave.vercel.app/icon.svg"
        },
        "sameAs": [
          "https://x.com/ClosureStudio",
          "https://www.linkedin.com/in/koushik-yerraguntla",
          "https://www.instagram.com/theclosure.studio/",
          "https://theclosurestudio.vercel.app/"
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
