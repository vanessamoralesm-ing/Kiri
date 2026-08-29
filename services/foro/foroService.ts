import {
    supabase,
} from "@/lib/supabase";

import type {
    ComentarioForo,
    CrearComentarioInput,
    CrearPublicacionInput,
    CrearReporteInput,
    CrearRespuestaPreguntaSemanaInput,
    EditarComentarioInput,
    EditarPublicacionInput,
    EmocionForo,
    PreguntaSemanaForo,
    PublicacionForo,
    RespuestaPreguntaSemanaConUsuario,
    RespuestaPreguntaSemanaForo,
    TipoReaccion,
    UsuarioForo,
} from "@/types/foro";


// ==========================================================
// TABLAS
// ==========================================================

const TABLAS = {
    usuario:
        "usuario",

    publicacion:
        "publicacion",

    comentario:
        "comentario",

    reaccion:
        "reaccion",

    emocion:
        "emocion_foro",

    publicacionEmocion:
        "publicacion_emocion_foro",

    reporte:
        "reporte",

    preguntaSemana:
        "pregunta_semana",

    respuestaPreguntaSemana:
        "respuesta_pregunta_semana",
} as const;


// ==========================================================
// STORAGE
// ==========================================================

/*
 * IMPORTANTE:
 *
 * Cambia "avatars" únicamente si tu bucket
 * de Supabase Storage tiene otro nombre.
 */

const BUCKET_FOTO_PERFIL =
    "avatars";


// ==========================================================
// HELPERS
// ==========================================================

function limpiarTexto(
    valor: string
): string {

    return valor.trim();

}


function quitarDuplicados(
    valores: string[]
): string[] {

    return [
        ...new Set(
            valores.filter(
                valor =>
                    Boolean(
                        valor
                    )
            )
        ),
    ];

}


// ==========================================================
// OBTENER URL DE FOTO DE PERFIL
// ==========================================================

function obtenerUrlFotoPerfil(
    ruta:
        string |
        null |
        undefined
): string | null {

    if (
        !ruta
    ) {

        return null;

    }


    const rutaLimpia =
        ruta.trim();


    if (
        !rutaLimpia
    ) {

        return null;

    }


    // ========================================================
    // YA ES UNA URL COMPLETA
    // ========================================================

    if (
        rutaLimpia.startsWith(
            "http://"
        ) ||
        rutaLimpia.startsWith(
            "https://"
        )
    ) {

        return rutaLimpia;

    }


    // ========================================================
    // QUITAR "/" AL INICIO
    // ========================================================

    const rutaStorage =
        rutaLimpia.replace(
            /^\/+/,
            ""
        );


    // ========================================================
    // GENERAR URL PÚBLICA
    // ========================================================

    const {
        data,
    } =
        supabase
            .storage
            .from(
                BUCKET_FOTO_PERFIL
            )
            .getPublicUrl(
                rutaStorage
            );


    if (
        !data?.publicUrl
    ) {

        return null;

    }


    return data.publicUrl;

}


// ==========================================================
// USUARIOS
// ==========================================================

async function obtenerUsuariosPorIds(
    idsUsuarios: string[]
): Promise<Map<string, UsuarioForo>> {

    const ids =
        quitarDuplicados(
            idsUsuarios
        );


    const mapa =
        new Map<
            string,
            UsuarioForo
        >();


    if (
        ids.length === 0
    ) {

        return mapa;

    }


    const {
        data,
        error,
    } =
        await supabase
            .from(
                TABLAS.usuario
            )
            .select(`
                id_usuario,
                nombres,
                apellidos,
                nombre_preferido,
                foto_perfil
            `)
            .in(
                "id_usuario",
                ids
            );


    if (
        error
    ) {

        console.error(
            "Error obteniendo usuarios del foro:",
            error
        );


        throw new Error(
            "No se pudieron cargar los usuarios del foro."
        );

    }


    (
        data ??
        []
    ).forEach(
        usuario => {

            const fotoPerfil =
                obtenerUrlFotoPerfil(
                    usuario.foto_perfil
                );


            mapa.set(
                usuario.id_usuario,
                {
                    id_usuario:
                        usuario.id_usuario,

                    nombres:
                        usuario.nombres,

                    apellidos:
                        usuario.apellidos,

                    nombre_preferido:
                        usuario.nombre_preferido,

                    foto_perfil:
                        fotoPerfil,
                }
            );

        }
    );


    return mapa;

}


// ==========================================================
// EMOCIONES
// ==========================================================

export async function obtenerEmocionesActivas():
    Promise<EmocionForo[]> {

    const {
        data,
        error,
    } =
        await supabase
            .from(
                TABLAS.emocion
            )
            .select(`
                id_emocion_foro,
                nombre,
                descripcion,
                estado,
                fecha_registro
            `)
            .eq(
                "estado",
                true
            )
            .order(
                "nombre",
                {
                    ascending:
                        true,
                }
            );


    if (
        error
    ) {

        console.error(
            "Error obteniendo emociones del foro:",
            error
        );


        throw new Error(
            "No se pudieron cargar las emociones del foro."
        );

    }


    return (
        data ??
        []
    ) as EmocionForo[];

}


// ==========================================================
// EMOCIONES DE PUBLICACIONES
// ==========================================================

async function obtenerEmocionesDePublicaciones(
    idsPublicaciones: string[]
): Promise<Map<string, EmocionForo[]>> {

    const mapa =
        new Map<
            string,
            EmocionForo[]
        >();


    const ids =
        quitarDuplicados(
            idsPublicaciones
        );


    if (
        ids.length === 0
    ) {

        return mapa;

    }


    const {
        data:
            relaciones,
        error:
            relacionesError,
    } =
        await supabase
            .from(
                TABLAS.publicacionEmocion
            )
            .select(`
                id_publicacion,
                id_emocion_foro
            `)
            .in(
                "id_publicacion",
                ids
            );


    if (
        relacionesError
    ) {

        console.error(
            "Error obteniendo relaciones publicación-emoción:",
            relacionesError
        );


        throw new Error(
            "No se pudieron cargar las emociones de las publicaciones."
        );

    }


    const idsEmociones =
        quitarDuplicados(
            (
                relaciones ??
                []
            ).map(
                relacion =>
                    relacion.id_emocion_foro
            )
        );


    if (
        idsEmociones.length === 0
    ) {

        return mapa;

    }


    const {
        data:
            emociones,
        error:
            emocionesError,
    } =
        await supabase
            .from(
                TABLAS.emocion
            )
            .select(`
                id_emocion_foro,
                nombre,
                descripcion,
                estado,
                fecha_registro
            `)
            .in(
                "id_emocion_foro",
                idsEmociones
            );


    if (
        emocionesError
    ) {

        console.error(
            "Error obteniendo emociones:",
            emocionesError
        );


        throw new Error(
            "No se pudieron cargar las emociones."
        );

    }


    const mapaEmociones =
        new Map<
            string,
            EmocionForo
        >();


    (
        emociones ??
        []
    ).forEach(
        emocion => {

            mapaEmociones.set(
                emocion.id_emocion_foro,
                emocion as EmocionForo
            );

        }
    );


    (
        relaciones ??
        []
    ).forEach(
        relacion => {

            const emocion =
                mapaEmociones.get(
                    relacion.id_emocion_foro
                );


            if (
                !emocion
            ) {

                return;

            }


            const actuales =
                mapa.get(
                    relacion.id_publicacion
                ) ??
                [];


            actuales.push(
                emocion
            );


            mapa.set(
                relacion.id_publicacion,
                actuales
            );

        }
    );


    return mapa;

}


// ==========================================================
// DATOS SOCIALES DE PUBLICACIONES
// ==========================================================

async function obtenerDatosSocialesPublicaciones(
    idsPublicaciones: string[],
    idUsuarioActual?: string
) {

    const mapaReacciones =
        new Map<
            string,
            number
        >();


    const mapaComentarios =
        new Map<
            string,
            number
        >();


    const mapaReaccionUsuario =
        new Map<
            string,
            TipoReaccion
        >();


    const ids =
        quitarDuplicados(
            idsPublicaciones
        );


    if (
        ids.length === 0
    ) {

        return {
            mapaReacciones,
            mapaComentarios,
            mapaReaccionUsuario,
        };

    }


    // ========================================================
    // REACCIONES
    // ========================================================

    const {
        data:
            reacciones,
        error:
            reaccionesError,
    } =
        await supabase
            .from(
                TABLAS.reaccion
            )
            .select(`
                id_publicacion,
                id_usuario,
                tipo_reaccion
            `)
            .in(
                "id_publicacion",
                ids
            );


    if (
        reaccionesError
    ) {

        console.error(
            "Error obteniendo reacciones:",
            reaccionesError
        );


        throw new Error(
            "No se pudieron cargar las reacciones del foro."
        );

    }


    (
        reacciones ??
        []
    ).forEach(
        reaccion => {

            const totalActual =
                mapaReacciones.get(
                    reaccion.id_publicacion
                ) ??
                0;


            mapaReacciones.set(
                reaccion.id_publicacion,
                totalActual + 1
            );


            if (
                idUsuarioActual &&
                reaccion.id_usuario ===
                idUsuarioActual
            ) {

                mapaReaccionUsuario.set(
                    reaccion.id_publicacion,
                    reaccion.tipo_reaccion as TipoReaccion
                );

            }

        }
    );


    // ========================================================
    // COMENTARIOS
    // ========================================================

    const {
        data:
            comentarios,
        error:
            comentariosError,
    } =
        await supabase
            .from(
                TABLAS.comentario
            )
            .select(`
                id_publicacion
            `)
            .in(
                "id_publicacion",
                ids
            )
            .eq(
                "estado",
                "activo"
            );


    if (
        comentariosError
    ) {

        console.error(
            "Error obteniendo comentarios:",
            comentariosError
        );


        throw new Error(
            "No se pudieron cargar los comentarios del foro."
        );

    }


    (
        comentarios ??
        []
    ).forEach(
        comentario => {

            const totalActual =
                mapaComentarios.get(
                    comentario.id_publicacion
                ) ??
                0;


            mapaComentarios.set(
                comentario.id_publicacion,
                totalActual + 1
            );

        }
    );


    return {
        mapaReacciones,
        mapaComentarios,
        mapaReaccionUsuario,
    };

}


// ==========================================================
// OBTENER PUBLICACIONES
// ==========================================================

export async function obtenerPublicaciones(
    idUsuarioActual?: string
): Promise<PublicacionForo[]> {

    const {
        data,
        error,
    } =
        await supabase
            .from(
                TABLAS.publicacion
            )
            .select(`
                id_publicacion,
                id_usuario,
                titulo,
                contenido,
                fecha_publicacion,
                fecha_actualizacion,
                estado,
                editada
            `)
            .eq(
                "estado",
                "activa"
            )
            .order(
                "fecha_publicacion",
                {
                    ascending:
                        false,
                }
            );


    if (
        error
    ) {

        console.error(
            "Error obteniendo publicaciones:",
            error
        );


        throw new Error(
            "No se pudieron cargar las publicaciones del foro."
        );

    }


    const publicaciones =
        (
            data ??
            []
        ) as PublicacionForo[];


    if (
        publicaciones.length === 0
    ) {

        return [];

    }


    const idsPublicaciones =
        publicaciones.map(
            publicacion =>
                publicacion.id_publicacion
        );


    const idsUsuarios =
        publicaciones.map(
            publicacion =>
                publicacion.id_usuario
        );


    const [
        usuarios,
        emociones,
        datosSociales,
    ] =
        await Promise.all([
            obtenerUsuariosPorIds(
                idsUsuarios
            ),

            obtenerEmocionesDePublicaciones(
                idsPublicaciones
            ),

            obtenerDatosSocialesPublicaciones(
                idsPublicaciones,
                idUsuarioActual
            ),
        ]);


    return publicaciones.map(
        publicacion => ({
            ...publicacion,

            usuario:
                usuarios.get(
                    publicacion.id_usuario
                ) ??
                null,

            emociones:
                emociones.get(
                    publicacion.id_publicacion
                ) ??
                [],

            total_reacciones:
                datosSociales
                    .mapaReacciones
                    .get(
                        publicacion.id_publicacion
                    ) ??
                0,

            total_comentarios:
                datosSociales
                    .mapaComentarios
                    .get(
                        publicacion.id_publicacion
                    ) ??
                0,

            reaccion_usuario:
                datosSociales
                    .mapaReaccionUsuario
                    .get(
                        publicacion.id_publicacion
                    ) ??
                null,
        })
    );

}


// ==========================================================
// OBTENER PUBLICACIÓN POR ID
// ==========================================================

export async function obtenerPublicacionPorId(
    idPublicacion: string,
    idUsuarioActual?: string
): Promise<PublicacionForo | null> {

    const {
        data,
        error,
    } =
        await supabase
            .from(
                TABLAS.publicacion
            )
            .select(`
                id_publicacion,
                id_usuario,
                titulo,
                contenido,
                fecha_publicacion,
                fecha_actualizacion,
                estado,
                editada
            `)
            .eq(
                "id_publicacion",
                idPublicacion
            )
            .eq(
                "estado",
                "activa"
            )
            .maybeSingle();


    if (
        error
    ) {

        console.error(
            "Error obteniendo publicación:",
            error
        );


        throw new Error(
            "No se pudo cargar la publicación."
        );

    }


    if (
        !data
    ) {

        return null;

    }


    const [
        usuarios,
        emociones,
        datosSociales,
    ] =
        await Promise.all([
            obtenerUsuariosPorIds([
                data.id_usuario,
            ]),

            obtenerEmocionesDePublicaciones([
                data.id_publicacion,
            ]),

            obtenerDatosSocialesPublicaciones(
                [
                    data.id_publicacion,
                ],
                idUsuarioActual
            ),
        ]);


    return {
        ...(data as PublicacionForo),

        usuario:
            usuarios.get(
                data.id_usuario
            ) ??
            null,

        emociones:
            emociones.get(
                data.id_publicacion
            ) ??
            [],

        total_reacciones:
            datosSociales
                .mapaReacciones
                .get(
                    data.id_publicacion
                ) ??
            0,

        total_comentarios:
            datosSociales
                .mapaComentarios
                .get(
                    data.id_publicacion
                ) ??
            0,

        reaccion_usuario:
            datosSociales
                .mapaReaccionUsuario
                .get(
                    data.id_publicacion
                ) ??
            null,
    };

}


// ==========================================================
// CREAR PUBLICACIÓN
// ==========================================================

export async function crearPublicacion({
    idUsuario,
    titulo,
    contenido,
    emociones = [],
}: CrearPublicacionInput):
    Promise<PublicacionForo> {

    const tituloLimpio =
        limpiarTexto(
            titulo
        );


    const contenidoLimpio =
        limpiarTexto(
            contenido
        );


    if (
        !tituloLimpio
    ) {

        throw new Error(
            "Debes escribir un título."
        );

    }


    if (
        !contenidoLimpio
    ) {

        throw new Error(
            "Debes escribir el contenido de la publicación."
        );

    }


    const {
        data:
            publicacion,
        error:
            publicacionError,
    } =
        await supabase
            .from(
                TABLAS.publicacion
            )
            .insert({
                id_usuario:
                    idUsuario,

                titulo:
                    tituloLimpio,

                contenido:
                    contenidoLimpio,

                estado:
                    "activa",

                editada:
                    false,
            })
            .select(`
                id_publicacion,
                id_usuario,
                titulo,
                contenido,
                fecha_publicacion,
                fecha_actualizacion,
                estado,
                editada
            `)
            .single();


    if (
        publicacionError
    ) {

        console.error(
            "Error creando publicación:",
            publicacionError
        );


        throw new Error(
            "No se pudo crear la publicación."
        );

    }


    const emocionesUnicas =
        quitarDuplicados(
            emociones
        );


    if (
        emocionesUnicas.length > 0
    ) {

        const relaciones =
            emocionesUnicas.map(
                idEmocion => ({
                    id_publicacion:
                        publicacion.id_publicacion,

                    id_emocion_foro:
                        idEmocion,
                })
            );


        const {
            error:
                emocionesError,
        } =
            await supabase
                .from(
                    TABLAS.publicacionEmocion
                )
                .insert(
                    relaciones
                );


        if (
            emocionesError
        ) {

            console.error(
                "Error guardando emociones:",
                emocionesError
            );


            await supabase
                .from(
                    TABLAS.publicacion
                )
                .delete()
                .eq(
                    "id_publicacion",
                    publicacion.id_publicacion
                )
                .eq(
                    "id_usuario",
                    idUsuario
                );


            throw new Error(
                "No se pudo completar la creación de la publicación."
            );

        }

    }


    const resultado =
        await obtenerPublicacionPorId(
            publicacion.id_publicacion,
            idUsuario
        );


    if (
        !resultado
    ) {

        throw new Error(
            "La publicación fue creada, pero no se pudo recuperar."
        );

    }


    return resultado;

}


// ==========================================================
// EDITAR PUBLICACIÓN
// ==========================================================

export async function editarPublicacion({
    idPublicacion,
    idUsuario,
    titulo,
    contenido,
    emociones,
}: EditarPublicacionInput):
    Promise<void> {

    const tituloLimpio =
        limpiarTexto(
            titulo
        );


    const contenidoLimpio =
        limpiarTexto(
            contenido
        );


    if (
        !tituloLimpio
    ) {

        throw new Error(
            "Debes escribir un título."
        );

    }


    if (
        !contenidoLimpio
    ) {

        throw new Error(
            "Debes escribir el contenido de la publicación."
        );

    }


    const {
        error,
    } =
        await supabase
            .from(
                TABLAS.publicacion
            )
            .update({
                titulo:
                    tituloLimpio,

                contenido:
                    contenidoLimpio,

                editada:
                    true,

                fecha_actualizacion:
                    new Date().toISOString(),
            })
            .eq(
                "id_publicacion",
                idPublicacion
            )
            .eq(
                "id_usuario",
                idUsuario
            );


    if (
        error
    ) {

        console.error(
            "Error editando publicación:",
            error
        );


        throw new Error(
            "No se pudo editar la publicación."
        );

    }


    if (
        emociones !== undefined
    ) {

        const {
            error:
                eliminarError,
        } =
            await supabase
                .from(
                    TABLAS.publicacionEmocion
                )
                .delete()
                .eq(
                    "id_publicacion",
                    idPublicacion
                );


        if (
            eliminarError
        ) {

            console.error(
                "Error eliminando emociones anteriores:",
                eliminarError
            );


            throw new Error(
                "La publicación fue actualizada, pero no se pudieron actualizar sus emociones."
            );

        }


        const emocionesUnicas =
            quitarDuplicados(
                emociones
            );


        if (
            emocionesUnicas.length > 0
        ) {

            const {
                error:
                    insertarError,
            } =
                await supabase
                    .from(
                        TABLAS.publicacionEmocion
                    )
                    .insert(
                        emocionesUnicas.map(
                            idEmocion => ({
                                id_publicacion:
                                    idPublicacion,

                                id_emocion_foro:
                                    idEmocion,
                            })
                        )
                    );


            if (
                insertarError
            ) {

                console.error(
                    "Error insertando nuevas emociones:",
                    insertarError
                );


                throw new Error(
                    "La publicación fue actualizada, pero no se pudieron guardar sus emociones."
                );

            }

        }

    }

}


// ==========================================================
// ELIMINAR PUBLICACIÓN
// ==========================================================

export async function eliminarPublicacion(
    idPublicacion: string,
    idUsuario: string
): Promise<void> {

    const {
        error,
    } =
        await supabase
            .from(
                TABLAS.publicacion
            )
            .update({
                estado:
                    "eliminada",

                fecha_actualizacion:
                    new Date().toISOString(),
            })
            .eq(
                "id_publicacion",
                idPublicacion
            )
            .eq(
                "id_usuario",
                idUsuario
            );


    if (
        error
    ) {

        console.error(
            "Error eliminando publicación:",
            error
        );


        throw new Error(
            "No se pudo eliminar la publicación."
        );

    }

}


// ==========================================================
// OBTENER COMENTARIOS
// ==========================================================

export async function obtenerComentarios(
    idPublicacion: string
): Promise<ComentarioForo[]> {

    const {
        data,
        error,
    } =
        await supabase
            .from(
                TABLAS.comentario
            )
            .select(`
                id_comentario,
                id_publicacion,
                id_usuario,
                contenido,
                fecha_comentario,
                fecha_actualizacion,
                estado,
                editada
            `)
            .eq(
                "id_publicacion",
                idPublicacion
            )
            .eq(
                "estado",
                "activo"
            )
            .order(
                "fecha_comentario",
                {
                    ascending:
                        true,
                }
            );


    if (
        error
    ) {

        console.error(
            "Error obteniendo comentarios:",
            error
        );


        throw new Error(
            "No se pudieron cargar los comentarios."
        );

    }


    const comentarios =
        (
            data ??
            []
        ) as ComentarioForo[];


    if (
        comentarios.length === 0
    ) {

        return [];

    }


    const usuarios =
        await obtenerUsuariosPorIds(
            comentarios.map(
                comentario =>
                    comentario.id_usuario
            )
        );


    return comentarios.map(
        comentario => ({
            ...comentario,

            usuario:
                usuarios.get(
                    comentario.id_usuario
                ) ??
                null,
        })
    );

}


// ==========================================================
// CREAR COMENTARIO
// ==========================================================

export async function crearComentario({
    idPublicacion,
    idUsuario,
    contenido,
}: CrearComentarioInput):
    Promise<ComentarioForo> {

    const contenidoLimpio =
        limpiarTexto(
            contenido
        );


    if (
        !contenidoLimpio
    ) {

        throw new Error(
            "Escribe un comentario antes de publicarlo."
        );

    }


    const {
        data,
        error,
    } =
        await supabase
            .from(
                TABLAS.comentario
            )
            .insert({
                id_publicacion:
                    idPublicacion,

                id_usuario:
                    idUsuario,

                contenido:
                    contenidoLimpio,

                estado:
                    "activo",

                editada:
                    false,
            })
            .select(`
                id_comentario,
                id_publicacion,
                id_usuario,
                contenido,
                fecha_comentario,
                fecha_actualizacion,
                estado,
                editada
            `)
            .single();


    if (
        error
    ) {

        console.error(
            "Error creando comentario:",
            error
        );


        throw new Error(
            "No se pudo publicar el comentario."
        );

    }


    const usuarios =
        await obtenerUsuariosPorIds([
            idUsuario,
        ]);


    return {
        ...(data as ComentarioForo),

        usuario:
            usuarios.get(
                idUsuario
            ) ??
            null,
    };

}


// ==========================================================
// EDITAR COMENTARIO
// ==========================================================

export async function editarComentario({
    idComentario,
    idUsuario,
    contenido,
}: EditarComentarioInput):
    Promise<void> {

    const contenidoLimpio =
        limpiarTexto(
            contenido
        );


    if (
        !contenidoLimpio
    ) {

        throw new Error(
            "El comentario no puede quedar vacío."
        );

    }


    const {
        error,
    } =
        await supabase
            .from(
                TABLAS.comentario
            )
            .update({
                contenido:
                    contenidoLimpio,

                editada:
                    true,

                fecha_actualizacion:
                    new Date().toISOString(),
            })
            .eq(
                "id_comentario",
                idComentario
            )
            .eq(
                "id_usuario",
                idUsuario
            );


    if (
        error
    ) {

        console.error(
            "Error editando comentario:",
            error
        );


        throw new Error(
            "No se pudo editar el comentario."
        );

    }

}


// ==========================================================
// ELIMINAR COMENTARIO
// ==========================================================

export async function eliminarComentario(
    idComentario: string,
    idUsuario: string
): Promise<void> {

    const {
        error,
    } =
        await supabase
            .from(
                TABLAS.comentario
            )
            .update({
                estado:
                    "eliminado",

                fecha_actualizacion:
                    new Date().toISOString(),
            })
            .eq(
                "id_comentario",
                idComentario
            )
            .eq(
                "id_usuario",
                idUsuario
            );


    if (
        error
    ) {

        console.error(
            "Error eliminando comentario:",
            error
        );


        throw new Error(
            "No se pudo eliminar el comentario."
        );

    }

}


// ==========================================================
// REACCIONAR PUBLICACIÓN
// ==========================================================

export async function reaccionarPublicacion(
    idPublicacion: string,
    idUsuario: string,
    tipoReaccion: TipoReaccion
): Promise<TipoReaccion | null> {

    const {
        data:
            reaccionActual,
        error:
            buscarError,
    } =
        await supabase
            .from(
                TABLAS.reaccion
            )
            .select(`
                id_reaccion,
                tipo_reaccion
            `)
            .eq(
                "id_publicacion",
                idPublicacion
            )
            .eq(
                "id_usuario",
                idUsuario
            )
            .maybeSingle();


    if (
        buscarError
    ) {

        console.error(
            "Error buscando reacción:",
            buscarError
        );


        throw new Error(
            "No se pudo procesar la reacción."
        );

    }


    // ========================================================
    // MISMA REACCIÓN -> QUITAR
    // ========================================================

    if (
        reaccionActual?.tipo_reaccion ===
        tipoReaccion
    ) {

        const {
            error,
        } =
            await supabase
                .from(
                    TABLAS.reaccion
                )
                .delete()
                .eq(
                    "id_reaccion",
                    reaccionActual.id_reaccion
                )
                .eq(
                    "id_usuario",
                    idUsuario
                );


        if (
            error
        ) {

            console.error(
                "Error eliminando reacción:",
                error
            );


            throw new Error(
                "No se pudo quitar la reacción."
            );

        }


        return null;

    }


    // ========================================================
    // CAMBIAR REACCIÓN
    // ========================================================

    if (
        reaccionActual
    ) {

        const {
            error,
        } =
            await supabase
                .from(
                    TABLAS.reaccion
                )
                .update({
                    tipo_reaccion:
                        tipoReaccion,
                })
                .eq(
                    "id_reaccion",
                    reaccionActual.id_reaccion
                )
                .eq(
                    "id_usuario",
                    idUsuario
                );


        if (
            error
        ) {

            console.error(
                "Error actualizando reacción:",
                error
            );


            throw new Error(
                "No se pudo cambiar la reacción."
            );

        }


        return tipoReaccion;

    }


    // ========================================================
    // NUEVA REACCIÓN
    // ========================================================

    const {
        error:
            insertarError,
    } =
        await supabase
            .from(
                TABLAS.reaccion
            )
            .insert({
                id_publicacion:
                    idPublicacion,

                id_usuario:
                    idUsuario,

                tipo_reaccion:
                    tipoReaccion,
            });


    if (
        insertarError
    ) {

        console.error(
            "Error creando reacción:",
            insertarError
        );


        throw new Error(
            "No se pudo registrar la reacción."
        );

    }


    return tipoReaccion;

}


// ==========================================================
// CREAR REPORTE
// ==========================================================

export async function crearReporte({
    idUsuarioReporta,
    idPublicacion = null,
    idComentario = null,
    motivo,
    descripcion = null,
}: CrearReporteInput):
    Promise<void> {

    if (
        !idPublicacion &&
        !idComentario
    ) {

        throw new Error(
            "Debes indicar la publicación o comentario que deseas reportar."
        );

    }


    if (
        idPublicacion &&
        idComentario
    ) {

        throw new Error(
            "Un reporte debe corresponder a una publicación o a un comentario, no a ambos."
        );

    }


    const descripcionLimpia =
        descripcion
            ?.trim() ||
        null;


    const {
        error,
    } =
        await supabase
            .from(
                TABLAS.reporte
            )
            .insert({
                id_usuario_reporta:
                    idUsuarioReporta,

                id_publicacion:
                    idPublicacion,

                id_comentario:
                    idComentario,

                motivo,

                descripcion:
                    descripcionLimpia,

                estado:
                    "pendiente",
            });


    if (
        error
    ) {

        console.error(
            "Error creando reporte:",
            error
        );


        throw new Error(
            "No se pudo enviar el reporte."
        );

    }

}


// ==========================================================
// PREGUNTA DE LA SEMANA
// ==========================================================


// ==========================================================
// OBTENER PREGUNTA DE LA SEMANA
// ==========================================================

export async function obtenerPreguntaSemanaActiva():
    Promise<PreguntaSemanaForo | null> {

    /*
     * Por ahora se obtiene la pregunta más reciente.
     *
     * Esto evita descartar el registro por problemas
     * de fechas mientras se termina de configurar
     * correctamente la administración de preguntas.
     */

    const {
        data,
        error,
    } =
        await supabase
            .from(
                TABLAS.preguntaSemana
            )
            .select(`
                id_pregunta_semana,
                pregunta,
                fecha_inicio,
                fecha_fin,
                estado
            `)
            .order(
                "fecha_inicio",
                {
                    ascending:
                        false,
                }
            )
            .limit(
                1
            )
            .maybeSingle();


    if (
        error
    ) {

        console.error(
            "Error obteniendo pregunta de la semana:",
            error
        );


        throw new Error(
            "No se pudo cargar la pregunta de la semana."
        );

    }


    if (
        !data
    ) {

        return null;

    }


    return data as PreguntaSemanaForo;

}


// ==========================================================
// RESPONDER PREGUNTA DE LA SEMANA
// ==========================================================

export async function responderPreguntaSemana({
    idPreguntaSemana,
    idUsuario,
    respuesta,
}: CrearRespuestaPreguntaSemanaInput):
    Promise<RespuestaPreguntaSemanaForo> {

    const respuestaLimpia =
        limpiarTexto(
            respuesta
        );


    // ========================================================
    // VALIDACIONES
    // ========================================================

    if (
        !idPreguntaSemana
    ) {

        throw new Error(
            "La pregunta de la semana no es válida."
        );

    }


    if (
        !idUsuario
    ) {

        throw new Error(
            "No se pudo identificar al usuario."
        );

    }


    if (
        !respuestaLimpia
    ) {

        throw new Error(
            "Escribe una respuesta antes de enviarla."
        );

    }


    if (
        respuestaLimpia.length > 500
    ) {

        throw new Error(
            "La respuesta no puede superar los 500 caracteres."
        );

    }


    // ========================================================
    // VERIFICAR PREGUNTA
    // ========================================================

    const {
        data:
            pregunta,
        error:
            preguntaError,
    } =
        await supabase
            .from(
                TABLAS.preguntaSemana
            )
            .select(`
                id_pregunta_semana,
                estado,
                fecha_inicio,
                fecha_fin
            `)
            .eq(
                "id_pregunta_semana",
                idPreguntaSemana
            )
            .maybeSingle();


    if (
        preguntaError
    ) {

        console.error(
            "Error verificando pregunta semanal:",
            preguntaError
        );


        throw new Error(
            "No se pudo verificar la pregunta de la semana."
        );

    }


    if (
        !pregunta
    ) {

        throw new Error(
            "Esta pregunta ya no está disponible."
        );

    }


    if (
        pregunta.estado !== true
    ) {

        throw new Error(
            "Esta pregunta ya no está activa."
        );

    }


    // ========================================================
    // VALIDAR FECHAS
    // ========================================================

    const ahora =
        new Date();


    const fechaInicio =
        new Date(
            pregunta.fecha_inicio
        );


    const fechaFin =
        pregunta.fecha_fin
            ? new Date(
                pregunta.fecha_fin
            )
            : null;


    if (
        Number.isNaN(
            fechaInicio.getTime()
        )
    ) {

        throw new Error(
            "La fecha de inicio de la pregunta no es válida."
        );

    }


    if (
        ahora < fechaInicio
    ) {

        throw new Error(
            "Esta pregunta todavía no está disponible."
        );

    }


    if (
        fechaFin
    ) {

        if (
            Number.isNaN(
                fechaFin.getTime()
            )
        ) {

            throw new Error(
                "La fecha de finalización de la pregunta no es válida."
            );

        }


        if (
            ahora > fechaFin
        ) {

            throw new Error(
                "El período para responder esta pregunta ya terminó."
            );

        }

    }


    // ========================================================
    // INSERTAR RESPUESTA
    // ========================================================

    const {
        data,
        error,
    } =
        await supabase
            .from(
                TABLAS.respuestaPreguntaSemana
            )
            .insert({
                id_pregunta_semana:
                    idPreguntaSemana,

                id_usuario:
                    idUsuario,

                respuesta:
                    respuestaLimpia,
            })
            .select(`
                id_respuesta,
                id_pregunta_semana,
                id_usuario,
                respuesta,
                fecha_respuesta
            `)
            .single();


    if (
        error
    ) {

        console.error(
            "Error guardando respuesta semanal:",
            error
        );


        throw new Error(
            "No se pudo guardar tu respuesta."
        );

    }


    return data as RespuestaPreguntaSemanaForo;

}


// ==========================================================
// RESPUESTAS DE UN USUARIO
// ==========================================================

export async function obtenerRespuestasPreguntaSemanaUsuario(
    idPreguntaSemana: string,
    idUsuario: string
): Promise<RespuestaPreguntaSemanaForo[]> {

    if (
        !idPreguntaSemana ||
        !idUsuario
    ) {

        return [];

    }


    const {
        data,
        error,
    } =
        await supabase
            .from(
                TABLAS.respuestaPreguntaSemana
            )
            .select(`
                id_respuesta,
                id_pregunta_semana,
                id_usuario,
                respuesta,
                fecha_respuesta
            `)
            .eq(
                "id_pregunta_semana",
                idPreguntaSemana
            )
            .eq(
                "id_usuario",
                idUsuario
            )
            .order(
                "fecha_respuesta",
                {
                    ascending:
                        false,
                }
            );


    if (
        error
    ) {

        console.error(
            "Error obteniendo respuestas del usuario:",
            error
        );


        throw new Error(
            "No se pudieron consultar tus respuestas."
        );

    }


    return (
        data ??
        []
    ) as RespuestaPreguntaSemanaForo[];

}


// ==========================================================
// TODAS LAS RESPUESTAS DE LA PREGUNTA
// ==========================================================

export async function obtenerRespuestasPreguntaSemana(
    idPreguntaSemana: string
): Promise<RespuestaPreguntaSemanaConUsuario[]> {

    if (
        !idPreguntaSemana
    ) {

        return [];

    }


    const {
        data,
        error,
    } =
        await supabase
            .from(
                TABLAS.respuestaPreguntaSemana
            )
            .select(`
                id_respuesta,
                id_pregunta_semana,
                id_usuario,
                respuesta,
                fecha_respuesta
            `)
            .eq(
                "id_pregunta_semana",
                idPreguntaSemana
            )
            .order(
                "fecha_respuesta",
                {
                    ascending:
                        false,
                }
            );


    if (
        error
    ) {

        console.error(
            "Error obteniendo respuestas de la semana:",
            error
        );


        throw new Error(
            "No se pudieron cargar las respuestas."
        );

    }


    const respuestas =
        (
            data ??
            []
        ) as RespuestaPreguntaSemanaForo[];


    if (
        respuestas.length === 0
    ) {

        return [];

    }


    const usuarios =
        await obtenerUsuariosPorIds(
            respuestas.map(
                respuesta =>
                    respuesta.id_usuario
            )
        );


    return respuestas.map(
        respuesta => ({
            ...respuesta,

            usuario:
                usuarios.get(
                    respuesta.id_usuario
                ) ??
                null,
        })
    );

}