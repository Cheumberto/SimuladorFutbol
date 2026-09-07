import { Injectable, signal } from '@angular/core';
import { equipo, jugador } from '../models/futbol.model';

@Injectable({
  providedIn: 'root',
})
export class Partido {

  readonly segunda_mitad = signal<boolean>(false);
  readonly partido_finalizado = signal<boolean>(false);
  readonly tiempo_segundos = signal<number>(0);
  readonly en_ejecucion = signal<boolean>(false);

  private Intervalo: any = null;

  readonly equipoA = signal<equipo>({
    id: 'equipoA',
    nombre: 'Equipo A',
    plantilla: [
      { id: 1, nombre: 'Emiliano Martínez', posicion: 'Portero', portero: true },
      { id: 2, nombre: 'William Saliba', posicion: 'Defensa', portero: false },
      { id: 3, nombre: 'Virgil van Dijk', posicion: 'Defensa', portero: false },
      { id: 4, nombre: 'Achraf Hakimi', posicion: 'Defensa', portero: false },
      { id: 5, nombre: 'Lisandro Martínez', posicion: 'Defensa', portero: false },
      { id: 6, nombre: 'Rodri Hernández', posicion: 'Centro', portero: false },
      { id: 7, nombre: 'Jude Bellingham', posicion: 'Centro', portero: false },
      { id: 8, nombre: 'Pedri', posicion: 'Centro', portero: false },
      { id: 9, nombre: 'Kylian Mbappé', posicion: 'Delantero', portero: false },
      { id: 10, nombre: 'Lionel Messi', posicion: 'Delantero', portero: false },
      { id: 11, nombre: 'Lamine Yamal', posicion: 'Delantero', portero: false },
      { id: 12, nombre: 'Thibaut Courtois', posicion: 'Portero', portero: true },
      { id: 13, nombre: 'Moisés Caicedo', posicion: 'Centro', portero: false },
      { id: 14, nombre: 'Harry Kane', posicion: 'Delantero', portero: false },
    ],
    jugadores: [],
    banca: [],
    portero_seleccionadoID: null,
    cambios: 3,
    plantilla_completa: false,
    goles: 0,
  });

  readonly equipoB = signal<equipo>({
    id: 'equipoB',
    nombre: 'Equipo B',
    plantilla: [
      { id: 21, nombre: 'Diogo Costa', posicion: 'Portero', portero: true },
      { id: 22, nombre: 'Ruben Dias', posicion: 'Defensa', portero: false },
      { id: 23, nombre: 'Cristian Romero', posicion: 'Defensa', portero: false },
      { id: 24, nombre: 'Pau Cubarsí', posicion: 'Defensa', portero: false },
      { id: 25, nombre: 'Nuno Mendes', posicion: 'Defensa', portero: false },
      { id: 26, nombre: 'Federico Valverde', posicion: 'Centro', portero: false },
      { id: 27, nombre: 'Florian Wirtz', posicion: 'Centro', portero: false },
      { id: 28, nombre: 'Jamal Musiala', posicion: 'Centro', portero: false },
      { id: 29, nombre: 'Erling Haaland', posicion: 'Delantero', portero: false },
      { id: 30, nombre: 'Vinícius Júnior', posicion: 'Delantero', portero: false },
      { id: 31, nombre: 'Bukayo Saka', posicion: 'Delantero', portero: false },
      { id: 32, nombre: 'Alisson Becker', posicion: 'Portero', portero: true },
      { id: 33, nombre: 'Declan Rice', posicion: 'Centro', portero: false },
      { id: 34, nombre: 'Cristiano Ronaldo', posicion: 'Delantero', portero: false },
    ],
    jugadores: [],
    banca: [],
    portero_seleccionadoID: null,
    cambios: 3,
    plantilla_completa: false,
    goles: 0,
  });

  Seleccionar_Jugadores(equipoID: 'equipoA' | 'equipoB', jugadores: jugador): void {
    const equipoSignal = equipoID === 'equipoA' ? this.equipoA : this.equipoB;
    const equipo = equipoSignal();

    if (equipo.plantilla_completa) {
      alert('La plantilla ya está completa. No se pueden seleccionar más jugadores.');
      return;
    }

    const jugador_activo = equipo.jugadores.some(p => p.id === jugadores.id);

    if (jugador_activo) {
      const nuevos_jugadores = equipo.jugadores.filter(p => p.id !== jugadores.id);
      const nuevo_portero = jugadores.id === equipo.portero_seleccionadoID ? null : equipo.portero_seleccionadoID;

      equipoSignal.set({
        ...equipo,
        jugadores: nuevos_jugadores,
        portero_seleccionadoID: nuevo_portero,
      });
    } else {
      if (equipo.jugadores.length >= 11) {
        alert('No se pueden seleccionar más de 11 jugadores.');
        return;
      }

      if (jugadores.portero || jugadores.posicion === 'Portero') {
        const existe_portero = equipo.jugadores.some(p => p.portero || p.posicion === 'Portero');
        if (existe_portero) {
          alert('Ya hay un portero seleccionado en la alineación.');
          return;
        }
      }

      const nuevo_portero = (jugadores.portero || jugadores.posicion === 'Portero') ? jugadores.id : equipo.portero_seleccionadoID;

      equipoSignal.set({
        ...equipo,
        jugadores: [...equipo.jugadores, jugadores],
        portero_seleccionadoID: nuevo_portero,
      });
    }
  }

  confirmar_plantilla(equipoID: 'equipoA' | 'equipoB'): void {
    const equipoSignal = equipoID === 'equipoA' ? this.equipoA : this.equipoB;
    const equipo = equipoSignal();

    if (equipo.jugadores.length !== 11) {
      alert('La plantilla debe tener exactamente 11 jugadores.');
      return;
    }

    if (equipo.portero_seleccionadoID === null) {
      alert('Debe seleccionar un portero para la plantilla.');
      return;
    }

    const jugadores_banca = equipo.plantilla.filter(p => !equipo.jugadores.some(j => j.id === p.id));

    equipoSignal.set({
      ...equipo,
      banca: jugadores_banca,
      plantilla_completa: true,
    });
  }

  iniciar_primer_tiempo(): void {
    if (!this.equipoA().plantilla_completa || !this.equipoB().plantilla_completa) {
      alert('Ambos equipos deben confirmar su plantilla de 11 jugadores para iniciar el partido.');
      return;
    }
    if (this.en_ejecucion()) return;

    this.en_ejecucion.set(true);
    this.iniciar_intervalo();
  }

  empezar_segunda_mitad(): void {
    if (this.partido_finalizado()) return;

    this.detener_intervalo();
    this.segunda_mitad.set(true);
    this.tiempo_segundos.set(45);
    this.en_ejecucion.set(true);
    this.iniciar_intervalo();
  }

  adelantar_tiempo(): void {
    if (this.partido_finalizado() || this.segunda_mitad()) return;

    this.detener_intervalo();

    const segundos_restantes = 45 - this.tiempo_segundos();
    for (let i = 0; i < segundos_restantes; i++) {
      this.evaluar_gol_aleatorio();
    }

    this.tiempo_segundos.set(45);
  }

  private iniciar_intervalo(): void {
    this.Intervalo = setInterval(() => {
      const tiempoLimite = this.segunda_mitad() ? 90 : 45;

      if (this.tiempo_segundos() >= tiempoLimite) {
        this.detener_intervalo();
        if (!this.segunda_mitad()) {
          alert('¡Final del Primer Tiempo (45s)! Puedes iniciar el segundo tiempo.');
        } else {
          this.finalizar_partido();
        }
        return;
      }

      this.tiempo_segundos.set(this.tiempo_segundos() + 1);
      this.evaluar_gol_aleatorio();
    }, 1000);
  }

  private detener_intervalo(): void {
    if (this.Intervalo) {
      clearInterval(this.Intervalo);
      this.Intervalo = null;
    }
    this.en_ejecucion.set(false);
  }

  private finalizar_partido(): void {
    this.detener_intervalo();
    this.partido_finalizado.set(true);
    alert(`¡Partido Finalizado!\nMarcador Final: ${this.equipoA().nombre} ${this.equipoA().goles} - ${this.equipoB().goles} ${this.equipoB().nombre}`);
  }

  private evaluar_gol_aleatorio(): void {
    const probGol = Math.random();
    if (probGol < 0.05) {
      const equipoGol = Math.random() < 0.5 ? 'equipoA' : 'equipoB';
      this.anotar_gol(equipoGol);
    }
  }

  private anotar_gol(equipoID: 'equipoA' | 'equipoB'): void {
    const equipoSignal = equipoID === 'equipoA' ? this.equipoA : this.equipoB;
    const equipo = equipoSignal();

    equipoSignal.set({
      ...equipo,
      goles: equipo.goles + 1
    });
  }

  hacer_cambio(equipoID: 'equipoA' | 'equipoB', jugador_salida: jugador, jugador_entrada: jugador): void {
    if (!this.segunda_mitad()) {
      alert('Los cambios solo se pueden realizar en la segunda mitad.');
      return;
    }

    if (this.partido_finalizado()) {
      alert('El partido ya ha finalizado.');
      return;
    }

    const equipoSignal = equipoID === 'equipoA' ? this.equipoA : this.equipoB;
    const equipo = equipoSignal();

    if (equipo.cambios <= 0) {
      alert('No quedan cambios disponibles.');
      return;
    }

    if (jugador_salida.id === equipo.portero_seleccionadoID) {
      alert('No se puede cambiar al portero titular.');
      return;
    }

    if (jugador_entrada.portero || jugador_entrada.posicion === 'Portero') {
      alert('No se puede ingresar a otro portero al campo de juego.');
      return;
    }

    equipoSignal.set({
      ...equipo,
      cambios: equipo.cambios - 1,
      jugadores: equipo.jugadores.map(p => p.id === jugador_salida.id ? jugador_entrada : p),
      banca: equipo.banca.map(p => p.id === jugador_entrada.id ? jugador_salida : p),
    });
  }
}