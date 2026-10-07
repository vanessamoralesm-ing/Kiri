import { useEffect, useRef, useState } from "react";

import { useModal } from "@/contexts/ModalContext";
import {
  cambiarEstadoUsuario,
  eliminarUsuarioAdmin,
  obtenerInstituciones,
  obtenerRoles,
  obtenerUsuarios,
} from "@/services/usuarios/usuarioService";
import type { EstadoUsuario, Rol } from "@/types/auth";
import type { InstitucionResumen, UsuarioAdmin } from "@/types/usuarios/usuario";

export default function useGestionUsuarios() {
  const { confirmar, avisar } = useModal();
  const ocupado = useRef(false);

  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [instituciones, setInstituciones] = useState<InstitucionResumen[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [idRol, setIdRol] = useState("");
  const [idInstitucion, setIdInstitucion] = useState("");
  const [estado, setEstado] = useState<EstadoUsuario | "">("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [procesando, setProcesando] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    Promise.all([obtenerRoles(), obtenerInstituciones()])
      .then(([r, i]) => activo && (setRoles(r), setInstituciones(i)))
      .catch((e) => console.error("Error cargando filtros:", e));
    return () => { activo = false; };
  }, []);

  useEffect(() => {
    let activo = true;
    const timer = setTimeout(async () => {
      try {
        setCargando(true);
        setError(null);
        const data = await obtenerUsuarios({ busqueda, idRol, idInstitucion, estado });
        if (activo) setUsuarios(data);
      } catch (e) {
        console.error("Error cargando usuarios:", e);
        if (activo) setError("No fue posible cargar los usuarios.");
      } finally {
        if (activo) setCargando(false);
      }
    }, 300);

    return () => {
      activo = false;
      clearTimeout(timer);
    };
  }, [busqueda, idRol, idInstitucion, estado]);

  const cambiarEstado = async (u: UsuarioAdmin) => {
    if (ocupado.current) return;

    const nuevo: EstadoUsuario = u.estado === "activo" ? "inactivo" : "activo";
    const accion = nuevo === "activo" ? "Activar" : "Inactivar";
    ocupado.current = true;

    try {
      if (!(await confirmar({
        titulo: `${accion} usuario`,
        mensaje: `¿Deseas ${accion.toLowerCase()} la cuenta de ${u.nombres} ${u.apellidos}?`,
        textoConfirmar: accion,
        peligro: nuevo === "inactivo",
        icono: nuevo === "activo" ? "checkmark-circle-outline" : "ban-outline",
      }))) return;

      setProcesando(u.id_usuario);
      await cambiarEstadoUsuario(u.id_usuario, nuevo);
      setUsuarios((x) => x.map((i) => i.id_usuario === u.id_usuario ? { ...i, estado: nuevo } : i));
      await avisar("Estado actualizado", `La cuenta quedó ${nuevo === "activo" ? "activa" : "inactiva"}.`);
    } catch (e) {
      console.error("Error cambiando estado:", e);
      await avisar("Error", e instanceof Error ? e.message : `No fue posible ${accion.toLowerCase()} el usuario.`, true);
    } finally {
      ocupado.current = false;
      setProcesando(null);
    }
  };

  const eliminar = async (u: UsuarioAdmin) => {
    if (ocupado.current) return;
    ocupado.current = true;

    try {
      if (!(await confirmar({
        titulo: "Eliminar usuario",
        mensaje: `¿Deseas eliminar definitivamente la cuenta de ${u.nombres} ${u.apellidos}?\n\nEsta acción no se puede deshacer.`,
        textoConfirmar: "Eliminar",
        peligro: true,
        icono: "trash-outline",
      }))) return;

      setProcesando(u.id_usuario);
      await eliminarUsuarioAdmin(u.id_usuario);
      setUsuarios((x) => x.filter((i) => i.id_usuario !== u.id_usuario));
      await avisar("Usuario eliminado", "La cuenta fue eliminada correctamente.");
    } catch (e) {
      console.error("Error eliminando usuario:", e);
      await avisar("Error", e instanceof Error ? e.message : "No fue posible eliminar el usuario.", true);
    } finally {
      ocupado.current = false;
      setProcesando(null);
    }
  };

  return {
    usuarios, roles, instituciones, busqueda, idRol, idInstitucion, estado,
    cargando, error, procesando,
    setBusqueda, setIdRol, setIdInstitucion, setEstado,
    cambiarEstado, eliminar,
  };
}