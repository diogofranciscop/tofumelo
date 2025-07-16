// Your page file
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Receitas Vegan',
  description:
    'Descubra as melhores receitas vegan para pequenos-almoços, almoços, jantares e sobremesas. Simples, saborosas e saudáveis.',
};

export default function Page() {
  return (
    <main>
      {/* Your page content goes here */}
      {/* Navbar is already rendered in layout, no need to include it here */}
      <div className="container mx-auto px-4">
        <h1 className="font-playfair text-4xl font-bold">Receitas Vegan</h1>
        {/* Rest of your page content */}

      </div>
    </main>
  );
}