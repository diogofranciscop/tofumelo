// app/[recipes]/page.tsx
"use client"
// app/[recipes]/page.tsx

import { useEffect, useState } from 'react'

type Props = {
  params: {
    slug: string
  }
}

export default function Page({ params }: Props) {
  const { slug } = params

  // Example to simulate fetching the recipe data
  const [recipe, setRecipe] = useState(null)

  useEffect(() => {
    // Fetching the post details based on slug from the public folder
    const fetchRecipe = async () => {
      const response = await fetch(`/public/recipes/2024-10-09-mousse-de-chocolate.json`)
      const data = await response.json()
      setRecipe(data)
    }
    fetchRecipe()
  }, [slug])

  if (!recipe) return <p>Loading...</p>

  return (
    <div>
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
      <img src={recipe.image} alt={recipe.title} width={500} height={500} />
      {/* Render other recipe details */}
    </div>
  )
}
