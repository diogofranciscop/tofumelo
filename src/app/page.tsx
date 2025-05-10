import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import ResponsiveLayout from '../components/ResponsiveLayout'; // No need for .tsx

export const metadata: Metadata = {
  title: 'Receitas Vegan',
  description:
    'Descubra as melhores receitas vegan para pequenos-almoços, almoços, jantares e sobremesas. Simples, saborosas e saudáveis.',
};

export default function Page() {
  return (
    <ResponsiveLayout />
  );
}