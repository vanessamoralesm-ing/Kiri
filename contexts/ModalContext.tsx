import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import ActionModal, { type ModalOptions } from "@/components/ui/ActionModal";

type Pedido = ModalOptions & { confirmacion: boolean; resolver: (aceptado: boolean) => void };
interface ModalApi {
  confirmar: (opciones: ModalOptions) => Promise<boolean>;
  avisar: (titulo: string, mensaje: string, peligro?: boolean) => Promise<void>;
}
const ModalContext = createContext<ModalApi | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const actual = useRef<Pedido | null>(null);
  const cola = useRef<Pedido[]>([]);
  const montado = useRef(true);
  useEffect(() => {
    montado.current = true;
    return () => {
      montado.current = false;
      actual.current?.resolver(false);
      cola.current.forEach((p) => p.resolver(false));
      actual.current = null;
      cola.current = [];
    };
  }, []);
  const siguiente = useCallback(() => {
    actual.current = cola.current.shift() ?? null;
    setPedido(actual.current);
  }, []);
  const solicitar = useCallback((opciones: ModalOptions, confirmacion: boolean) =>
    new Promise<boolean>((resolver) => {
      if (!montado.current) { resolver(false); return; }
      cola.current.push({ ...opciones, confirmacion, resolver });
      if (!actual.current) siguiente();
    }), [siguiente]);
  const confirmar = useCallback((opciones: ModalOptions) => solicitar(opciones, true), [solicitar]);
  const avisar = useCallback(async (titulo: string, mensaje: string, peligro = false) => {
    await solicitar({ titulo, mensaje, peligro, icono: peligro ? "alert-circle-outline" : "checkmark-circle-outline" }, false);
  }, [solicitar]);
  const responder = (aceptado: boolean) => {
    if (!pedido || actual.current !== pedido) return;
    siguiente();
    pedido.resolver(aceptado);
  };
  const api = useMemo(() => ({ confirmar, avisar }), [confirmar, avisar]);
  return (
    <ModalContext.Provider value={api}>
      {children}
      <ActionModal visible={!!pedido} titulo={pedido?.titulo ?? ""} mensaje={pedido?.mensaje ?? ""}
        textoConfirmar={pedido?.textoConfirmar} peligro={pedido?.peligro} icono={pedido?.icono}
        onClose={() => responder(false)} onConfirm={pedido?.confirmacion ? () => responder(true) : undefined} />
    </ModalContext.Provider>
  );
}
export function useModal() {
  const modal = useContext(ModalContext);
  if (!modal) throw new Error("useModal debe utilizarse dentro de ModalProvider.");
  return modal;
}
