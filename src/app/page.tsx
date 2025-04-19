import Link from 'next/link'
 
export default async function Post({ post }) {
  const posts = await getPosts()
 
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.recipes}>
          <Link href={`${post.recipes}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}