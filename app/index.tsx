//import AnimatedLogo from '@/components/ui/AnimatedLogo';
import AnimatedLogo from '@/components/ui/AnimatedLogo';
import React from 'react';
import AnimatedLogo from "@/components/ui/AnimatedLogo";

// Pantalla inicial de Kiri.
// app/_layout.tsx controla el tiempo minimo del splash
// y, cuando AuthProvider termina de comprobar la sesion,
// redirige a welcome o home segun corresponda.
export default function Index() {
  return <AnimatedLogo />;

  //return <Redirect href="/cuestionarios" />; //Redireccionamiento temporal a la pantalla de cuestionarios para pruebas.

}
