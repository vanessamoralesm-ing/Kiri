import { router } from "expo-router";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useModal } from "@/contexts/ModalContext";

import type {
  UsuarioFormValues,
} from "@/components/usuarios/UsuarioForm";

import {
  normalizarRol,
  type UsuarioRoleValues,
} from "@/components/usuarios/UsuarioRoleFields";

import {
  crearUsuarioAdmin,
  editarUsuarioAdmin,
  obtenerDatosDocente,
  obtenerDatosEstudiante,
  obtenerDatosPsicologo,
  obtenerInstituciones,
  obtenerRoles,
  obtenerUsuarioPorId,
} from "@/services/usuarios/usuarioService";

import type {
  EstadoUsuario,
  Genero,
  Rol,
} from "@/types/auth";

import type {
  InstitucionResumen,
} from "@/types/usuarios/usuario";

import {
  validateRegister,
} from "@/utils/validations";

export type UsuarioAdminFormModo =
  | "crear"
  | "editar";

interface Options {
  modo: UsuarioAdminFormModo;
  idUsuario?: string;
}

const FORM_INICIAL: UsuarioFormValues = {
  nombres: "",
  apellidos: "",
  nombrePreferido: "",
  telefono: "",
  email: "",
  fechaNacimiento: "",
  genero: "",
  password: "",
  confirmPassword: "",
};

const ROLE_INICIAL: UsuarioRoleValues = {
  codigoEstudiante: "",

  codigoDocente: "",
  profesion: "",
  especialidadDocente: "",

  codigoPsicologo: "",
  licenciaProfesional: "",
  especialidadPsicologo: "",
};

export function useUsuarioAdminForm({
  modo,
  idUsuario,
}: Options) {
  const { confirmar, avisar } = useModal();
  const enviando = useRef(false);
  const [
    values,
    setValues,
  ] = useState<UsuarioFormValues>(
    FORM_INICIAL,
  );

  const [
    roleValues,
    setRoleValues,
  ] = useState<UsuarioRoleValues>(
    ROLE_INICIAL,
  );

  const [roles, setRoles] =
    useState<Rol[]>([]);

  const [
    instituciones,
    setInstituciones,
  ] = useState<
    InstitucionResumen[]
  >([]);

  const [idRol, setIdRol] =
    useState("");

  const [
    idInstitucion,
    setIdInstitucion,
  ] = useState("");

  const [estado, setEstado] =
    useState<EstadoUsuario>(
      "activo",
    );

  const [
    debeCambiarPassword,
    setDebeCambiarPassword,
  ] = useState(
    modo === "crear",
  );

  const [error, setError] =
    useState<string | null>(
      null,
    );

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const rolSeleccionado =
    useMemo(
      () =>
        roles.find(
          (rol) =>
            rol.id_rol ===
            idRol,
        ),
      [roles, idRol],
    );

  const claveRol =
    normalizarRol(
      rolSeleccionado?.nombre,
    );

  const esEstudiante =
    claveRol ===
    "estudiante";

  const esDocente =
    claveRol ===
    "docente";

  const esPsicologo =
    claveRol ===
      "psicologo" ||
    claveRol ===
      "psicologo_institucional";

  const cambiarCampo = <
    K extends keyof UsuarioFormValues,
  >(
    campo: K,
    value:
      UsuarioFormValues[K],
  ) => {
    setValues((prev) => ({
      ...prev,
      [campo]: value,
    }));

    setError(null);
  };

  const cambiarCampoRol = <
    K extends keyof UsuarioRoleValues,
  >(
    campo: K,
    value:
      UsuarioRoleValues[K],
  ) => {
    setRoleValues(
      (prev) => ({
        ...prev,
        [campo]: value,
      }),
    );

    setError(null);
  };

  const volver = () =>
    router.replace(
      "/superadmin/usuarios" as never,
    );

  // ========================================================
  // CARGAR
  // ========================================================

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true);
        setError(null);

        const [
          rolesData,
          institucionesData,
        ] = await Promise.all([
          obtenerRoles(),
          obtenerInstituciones(),
        ]);

        setRoles(rolesData);

        setInstituciones(
          institucionesData,
        );

        if (
          modo !== "editar"
        ) {
          return;
        }

        if (!idUsuario) {
          throw new Error(
            "No se encontró el usuario.",
          );
        }

        const usuario =
          await obtenerUsuarioPorId(
            idUsuario,
          );

        setValues({
          nombres:
            usuario.nombres ?? "",

          apellidos:
            usuario.apellidos ?? "",

          nombrePreferido:
            usuario.nombre_preferido ??
            "",

          telefono:
            usuario.telefono ?? "",

          email:
            usuario.correo ?? "",

          fechaNacimiento:
            usuario.fecha_nacimiento ??
            "",

          genero:
            usuario.genero ?? "",

          password: "",

          confirmPassword: "",
        });

        setIdRol(
          usuario.id_rol,
        );

        setIdInstitucion(
          usuario.id_institucion ??
            "",
        );

        setEstado(
          usuario.estado,
        );

        setDebeCambiarPassword(
          usuario.debe_cambiar_password,
        );

        const rolActual =
          normalizarRol(
            usuario.rol?.nombre,
          );

        if (
          rolActual ===
          "estudiante"
        ) {
          const data =
            await obtenerDatosEstudiante(
              idUsuario,
            );

          if (data) {
            setRoleValues(
              (prev) => ({
                ...prev,

                codigoEstudiante:
                  data.codigoEstudiante ??
                  "",
              }),
            );
          }
        }

        if (
          rolActual ===
          "docente"
        ) {
          const data =
            await obtenerDatosDocente(
              idUsuario,
            );

          if (data) {
            setRoleValues(
              (prev) => ({
                ...prev,

                codigoDocente:
                  data.codigoDocente ??
                  "",

                profesion:
                  data.profesion ??
                  "",

                especialidadDocente:
                  data.especialidad ??
                  "",
              }),
            );
          }
        }

        if (
          rolActual ===
            "psicologo" ||
          rolActual ===
            "psicologo_institucional"
        ) {
          const data =
            await obtenerDatosPsicologo(
              idUsuario,
            );

          if (data) {
            setRoleValues(
              (prev) => ({
                ...prev,

                codigoPsicologo:
                  data.codigoPsicologo ??
                  "",

                licenciaProfesional:
                  data.licenciaProfesional ??
                  "",

                especialidadPsicologo:
                  data.especialidad ??
                  "",
              }),
            );
          }
        }
      } catch (err) {
        console.error(
          "Error cargando usuario:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "No fue posible cargar los datos.",
        );
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [modo, idUsuario]);

  // ========================================================
  // VALIDAR
  // ========================================================

  const validar =
    (): Genero | null => {
      const genero =
        values.genero;

      if (!genero) {
        setError(
          "Selecciona una opción de género.",
        );

        return null;
      }

      if (!idRol) {
        setError(
          "Selecciona un rol.",
        );

        return null;
      }

      if (
        modo === "crear"
      ) {
        const errores =
          validateRegister({
            email:
              values.email,

            password:
              values.password,

            confirmPassword:
              values.confirmPassword,

            nombres:
              values.nombres,

            apellidos:
              values.apellidos,

            nombrePreferido:
              values.nombrePreferido,

            telefono:
              values.telefono,

            fechaNacimiento:
              values.fechaNacimiento,

            genero,

            aceptaTerminos:
              true,
          });

        const primero =
          Object.values(
            errores,
          ).find(Boolean);

        if (primero) {
          setError(
            String(primero),
          );

          return null;
        }
      } else {
        if (
          !values.nombres.trim()
        ) {
          setError(
            "Ingresa los nombres.",
          );

          return null;
        }

        if (
          !values.apellidos.trim()
        ) {
          setError(
            "Ingresa los apellidos.",
          );

          return null;
        }

        if (
          !values.fechaNacimiento
        ) {
          setError(
            "Selecciona la fecha de nacimiento.",
          );

          return null;
        }
      }

      return genero;
    };

  // ========================================================
  // GUARDAR
  // ========================================================

  const guardar = async () => {
    if (enviando.current) return;

    setError(null);

    const genero =
      validar();

    if (!genero) return;

    const estudiante =
      esEstudiante
        ? {
            codigoEstudiante:
              roleValues.codigoEstudiante
                .trim() || null,
          }
        : undefined;

    const docente =
      esDocente
        ? {
            codigoDocente:
              roleValues.codigoDocente
                .trim() || null,

            profesion:
              roleValues.profesion
                .trim() || null,

            especialidad:
              roleValues.especialidadDocente
                .trim() || null,
          }
        : undefined;

    const psicologo =
      esPsicologo
        ? {
            codigoPsicologo:
              roleValues.codigoPsicologo
                .trim() || null,

            licenciaProfesional:
              roleValues.licenciaProfesional
                .trim() || null,

            especialidad:
              roleValues.especialidadPsicologo
                .trim() || null,
          }
        : undefined;

    enviando.current = true;
    try {
      if (modo === "editar") {
        if (!idUsuario) throw new Error("Usuario inválido.");
        if (!(await confirmar({
          titulo: "Guardar cambios",
          mensaje: `¿Deseas guardar los cambios de ${values.nombres.trim()} ${values.apellidos.trim()}?`,
          textoConfirmar: "Guardar cambios",
          icono: "create-outline",
        }))) return;
      }
      setGuardando(true);

      if (
        modo === "crear"
      ) {
        await crearUsuarioAdmin({
          email:
            values.email
              .trim()
              .toLowerCase(),

          passwordTemporal:
            values.password,

          nombres:
            values.nombres.trim(),

          apellidos:
            values.apellidos.trim(),

          nombrePreferido:
            values.nombrePreferido
              .trim() ||
            undefined,

          telefono:
            values.telefono
              .trim() ||
            undefined,

          fechaNacimiento:
            values.fechaNacimiento ||
            undefined,

          genero,

          idRol,

          idInstitucion:
            idInstitucion ||
            null,

          estado,

          debeCambiarPassword,

          estudiante,
          docente,
          psicologo,
        });

        await avisar(
          "Usuario registrado",
          "La cuenta fue creada correctamente.",
        );
      } else {
        if (!idUsuario) {
          throw new Error(
            "Usuario inválido.",
          );
        }

        await editarUsuarioAdmin({
          idUsuario,

          nombres:
            values.nombres.trim(),

          apellidos:
            values.apellidos.trim(),

          nombrePreferido:
            values.nombrePreferido
              .trim() ||
            null,

          telefono:
            values.telefono
              .trim() ||
            null,

          fechaNacimiento:
            values.fechaNacimiento ||
            null,

          genero,

          idRol,

          idInstitucion:
            idInstitucion ||
            null,

          estado,

          debeCambiarPassword,

          estudiante,
          docente,
          psicologo,
        });

        await avisar(
          "Usuario actualizado",
          "Los cambios se guardaron correctamente.",
        );
      }

      volver();
    } catch (err) {
      console.error(
        `Error ${
          modo === "crear"
            ? "creando"
            : "editando"
        } usuario:`,
        err,
      );

      const mensaje = err instanceof Error ? err.message : "No fue posible guardar los cambios.";
      setError(mensaje);
      await avisar("Error", mensaje, true);
    } finally {
      enviando.current = false;
      setGuardando(false);
    }
  };

  return {
    modo,

    values,
    roleValues,

    roles,
    instituciones,
    rolSeleccionado,

    idRol,
    idInstitucion,
    estado,
    debeCambiarPassword,

    error,
    cargando,
    guardando,

    cambiarCampo,
    cambiarCampoRol,

    setIdRol: (
      value: string,
    ) => {
      setIdRol(value);
      setError(null);
    },

    setIdInstitucion: (
      value: string,
    ) => {
      setIdInstitucion(
        value,
      );

      setError(null);
    },

    setEstado,

    setDebeCambiarPassword,

    volver,
    guardar,
  };
}
