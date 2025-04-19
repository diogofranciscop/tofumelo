import Image from 'next/image'
import Link from 'next/link' // You forgot to import Link!
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Receitas Vegan',
  description: 'Descubra as melhores receitas vegan para pequenos-almoços, almoços, jantares e sobremesas. Simples, saborosas e saudáveis.',
}

export default function Page() {
  return (
    <>
      <nav>
        <Link href="/recipes">Dashboard</Link>
      </nav>
      <div>
        <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1>
        <Image
          src="/recipes-img/almondegas.webp"
          alt="Almôndegas vegan"
          width={500}
          height={500}
        />
      </div>
    </>
  )
}
