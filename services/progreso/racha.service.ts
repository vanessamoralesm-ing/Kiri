export type DiaRacha = {
    fecha: string;
    completado: boolean;
};

export type ResumenRacha = {
    rachaActual: number;
    actividadHoy: boolean;
    dias: DiaRacha[];
};
