"use client"

import { useSearchParams, useRouter } from "next/navigation"

const categories = ["البرمجة", "الاستشراق", "التربية", "الشريعة", "اللغة", "الرياضيات", "الهندسة", "الاقتصاد"]

export function Categories() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category") || "الرئيسية"

  function handleCategoryClick(category: string) {
    if (currentCategory === category) {
      router.push("/")
    } else {
      router.push(`/?category=${category}`)
    }
  }

  return (
    <div>
      <h1 className="font-medium text-xl mb-8">منشورات من جميع الاهتمامات</h1>
      <div className="flex gap-3 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`tag ${currentCategory === category ? "bg-black text-white" : ""}`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}