import ReduxUI from "./redux"
import "./globals.css?url";
import { getUserAuthenticated } from "./services/auth.server"
import User from './controllers/User.server'


export async function generateMetadata() {
  return {
    title: {
      template: "%s | " + process.env.SITE_NAME,
      default: process.env.SITE_NAME,
    },
    description: process.env.SITE_DESCRIPTION,
    icons: {
      icon: "/favicon.ico",
    },
    robots: {
      index: true,
      follow: true,
    },
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
    },
    themeColor: "#000000",
    colorScheme: "light",
    creator: process.env.SITE_NAME,
    publisher: process.env.SITE_NAME,
    site: process.env.SITE_URL,
    applicationName: process.env.SITE_NAME,
    referrer: "origin-when-cross-origin",
    keywords: process.env.SITE_KEYWORDS,
    authors: [{ name: process.env.SITE_NAME, url: process.env.SITE_URL }],
    formatDetection: {
      email: true,
      address: true,
      telephone: true,
    },
    category: [
      "education",
      "academic",
      "research",
      "higher education",
      "scientific publications",
      "موريتانيا",
      "منشورات أكاديمية",
      "بحث علمي",
      "دراسات عليا",
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: process.env.SITE_NAME,
      description: process.env.SITE_DESCRIPTION,
      author: {
        "@type": "Organization",
        name: process.env.SITE_NAME,
      },
      publisher: {
        "@type": "Organization",
        name: process.env.SITE_NAME,
        logo: {
          "@type": "ImageObject",
          url: process.env.SITE_URL + "/favicon.ico",
        },
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      isPartOf: {
        "@type": "WebPage",
        "@id": process.env.SITE_URL,
      },
      inLanguage: "ar",
      potentialAction: [
        {
          "@type": "SearchAction",
          target: process.env.SITE_URL + "/search?q={search_term_string}",
          queryInput: "required name=search_term_string",
        },
      ],
      url: process.env.SITE_URL,
      sameAs: [
        process.env.SITE_URL,
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: process.env.SITE_PHONE,
        contactType: "customer service",
        email: process.env.SITE_EMAIL,
        areaServed: "SA",
        availableLanguage: ["ar"],
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "MR",
        addressLocality: process.env.SITE_CITY,
        addressRegion: process.env.SITE_REGION,
        postalCode: process.env.SITE_POSTAL_CODE,
        streetAddress: process.env.SITE_ADDRESS,
      },
      about: {
        "@type": "Thing",
        name: "النشر الأكاديمي والبحث العلمي في موريتانيا",
        description: process.env.SITE_DESCRIPTION
      },
      audience: {
        "@type": "Audience",
        audienceType: "الباحثين والأكاديميين وطلاب الدراسات العليا في موريتانيا"
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": process.env.SITE_URL
      },
      additionalType: "https://schema.org/EducationalOrganization",
    },
    openGraph: {
      title: process.env.SITE_NAME + " - المنصة الأكاديمية الرائدة في موريتانيا",
      description: process.env.SITE_DESCRIPTION,
      url: process.env.SITE_URL,
      siteName: process.env.SITE_NAME,
      images: [
        {
          url: process.env.SITE_URL + '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: process.env.SITE_NAME,
        }
      ],
      locale: 'ar_MR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: process.env.SITE_NAME + " | البوابة الأكاديمية الموريتانية",
      description: process.env.SITE_DESCRIPTION,
      images: [process.env.SITE_URL + '/og-image.jpg'],
      creator: process.env.SITE_TWITTER_HANDLE,
    },
    contacts: {
      email: process.env.SITE_EMAIL,
      phone: process.env.SITE_PHONE,
      address: process.env.SITE_ADDRESS,
    },
    canonical: process.env.SITE_URL,
    alternates: {
      canonical: process.env.SITE_URL,
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let isNewNotification = false
  const user = await getUserAuthenticated()
  if(user){
    const response = await User.getNewNotification(user.username)
    if(response.status === "success"){
      isNewNotification = true
    }
  }

  return (
    <html lang="ar">
      <head />
      <body dir="rtl">
        <ReduxUI user={user} newNotification={isNewNotification as boolean}>
            {children}
        </ReduxUI>
      </body>
    </html>
  )
}