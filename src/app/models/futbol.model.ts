export type posicion = 'Portero' | 'Defensa' | 'Centro' | 'Delantero';

export interface jugador {
  id: number;
  nombre: string;
  posicion: posicion;
  portero: boolean;
}

export interface equipo {
    id: 'equipoA' | 'equipoB';
    nombre: string;
    plantilla: jugador[];
    jugadores: jugador[];
    banca: jugador[];
    portero_seleccionadoID: number | null;
    cambios: number;
    plantilla_completa: boolean;
    goles: number;
}