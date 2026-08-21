import React from 'react';
import AnimatedLogo from '@/components/ui/AnimatedLogo';

// Pantalla que se muestra mientras app/_layout.tsx (RootNavigation)
// resuelve el estado de la sesión. No navega por sí sola — en cuanto
// AuthProvider termina de cargar, el _layout.tsx redirige automáticamente
// a "/(auth)/welcome" o "/(tabs)/home" según corresponda.
export default function Index() {
  return <AnimatedLogo />;
}