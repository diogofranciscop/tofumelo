import type { Metadata, ResolvingMetadata } from 'next'
import fs from 'fs'
import path from 'path'

type Props = {
  params: { slug: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params

  // Build the path to the JSON file based on the slug
  const postPath = path.join(process.cwd(),'src','public', 'recipes', `2024-10-09-mousse-de-chocolate.json`)

  // Read and parse the JSON post file
  const fileContent = fs.readFileSync(postPath, 'utf-8')
  const post = JSON.parse(fileContent)

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords.split(',').map((k: string) => k.trim()),
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav>
        {/* Example Navigation */}
        <a href="/">Home</a>
      </nav>
      <main>{children}</main>
    </div>
  )
}
