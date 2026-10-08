import React from "react";
import { Text } from "react-native";
import AdminList from "@/components/admin/AdminList";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import type { AdminColumn } from "@/components/admin/AdminTable";
import type { UsuarioAdmin } from "@/types/usuarios/usuario";
import UsuarioCard, {
  UsuarioAcciones,
  UsuarioIdentidad,
  type UsuarioPresentationProps,
} from "./UsuarioCard";
import UsuarioRoleBadge from "./UsuarioRoleBadge";

type Props = UsuarioPresentationProps & { usuarios: UsuarioAdmin[] };
export default function UsuarioList({ usuarios, ...props }: Props) {
  const columnas: AdminColumn<UsuarioAdmin>[] = [
    {
      key: "usuario",
      title: "USUARIO",
      className: "w-72",
      render: (usuario) => <UsuarioIdentidad usuario={usuario} />,
    },
    {
      key: "rol",
      title: "ROL",
      render: (usuario) => <UsuarioRoleBadge rol={usuario.rol?.nombre} />,
    },
  ];
  if (props.mostrarInstitucion !== false)
    columnas.push({
      key: "institucion",
      title: "INSTITUCIÓN",
      className: "w-80",
      render: (usuario) => (
        <Text className="font-nunito-medium text-sm text-text-secondary">
          {usuario.institucion?.nombre ?? "Sin institución"}
        </Text>
      ),
    });
  if (props.mostrarEstado !== false)
    columnas.push({
      key: "estado",
      title: "ESTADO",
      className: "w-32",
      render: (usuario) => <AdminStatusBadge estado={usuario.estado} />,
    });
  columnas.push({
    key: "acciones",
    title: "ACCIONES",
    render: (usuario) => <UsuarioAcciones usuario={usuario} {...props} />,
  });
  return (
    <AdminList
      items={usuarios}
      columns={columnas}
      keyExtractor={(usuario) => usuario.id_usuario}
      renderCard={(usuario) => <UsuarioCard usuario={usuario} {...props} />}
    />
  );
}
