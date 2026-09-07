import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Partido } from './services/partido';
import { jugador } from './models/futbol.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent {

  public partidoService = inject(Partido);

  mostrarCambiosA = signal(false);
  mostrarCambiosB = signal(false);

  fase = signal<'inicio' | 'seleccion' | 'partido'>('inicio');

  jugador_salida_A = signal<jugador | null>(null);
  jugador_entrada_A = signal<jugador | null>(null);

  jugador_salida_B = signal<jugador | null>(null);
  jugador_entrada_B = signal<jugador | null>(null);

  irASeleccion(): void {
    this.fase.set('seleccion');
  }

  confirmarYComenzar(): void {
    if (!this.partidoService.equipoA().plantilla_completa || !this.partidoService.equipoB().plantilla_completa) {
      alert('Ambos equipos deben confirmar su alineación de 11 jugadores.');
      return;
    }
    this.fase.set('partido');
  }

  seleccionar_jugador(equipoID: 'equipoA' | 'equipoB', j: jugador): void {
    this.partidoService.Seleccionar_Jugadores(equipoID, j);
  }

  confirmar_plantilla(equipoID: 'equipoA' | 'equipoB'): void {
    this.partidoService.confirmar_plantilla(equipoID);
  }

  iniciar_primer_tiempo(): void {
    this.partidoService.iniciar_primer_tiempo();
  }

  empezar_segunda_mitad(): void {
    this.partidoService.empezar_segunda_mitad();
  }

  adelantar_tiempo(): void {
    this.partidoService.adelantar_tiempo();
  }

  hacer_cambio(equipoID: 'equipoA' | 'equipoB'): void {
    const salir = equipoID === 'equipoA' ? this.jugador_salida_A() : this.jugador_salida_B();
    const entrar = equipoID === 'equipoA' ? this.jugador_entrada_A() : this.jugador_entrada_B();

    if (!salir || !entrar) {
      alert('Debe seleccionar un jugador que sale y uno que entra.');
      return;
    }

    this.partidoService.hacer_cambio(equipoID, salir, entrar);

    if (equipoID === 'equipoA') {
      this.jugador_salida_A.set(null);
      this.jugador_entrada_A.set(null);
    } else {
      this.jugador_salida_B.set(null);
      this.jugador_entrada_B.set(null);
    }
  }

  getPosicionEstilizada(posicion: string, index: number, esEquipoA: boolean): { left: string, top: string } {

    const posiciones433: { [key: number]: { xA: number; y: number } } = {

      0:  { xA: 6,  y: 50 },

      1:  { xA: 18, y: 15 }, 
      2:  { xA: 16, y: 38 }, 
      3:  { xA: 16, y: 62 }, 
      4:  { xA: 18, y: 85 }, 

      5:  { xA: 30, y: 25 }, 
      6:  { xA: 27, y: 50 }, 
      7:  { xA: 30, y: 75 }, 
     
      8:  { xA: 42, y: 20 }, 
      9:  { xA: 44, y: 50 }, 
      10: { xA: 42, y: 80 }  
    };

    const posIdx = index % 11;
    const base = posiciones433[posIdx] || { xA: 25, y: 15 + ((index * 10) % 70) };

    let baseCoordinates = {
      x: esEquipoA ? base.xA : (100 - base.xA),
      y: base.y
    };

    if (index >= 11) {
      const offsetFactor = Math.floor(index / 11);
      const shiftX = (index % 2 === 0 ? 1 : -1) * (offsetFactor * 2);
      const shiftY = (index % 3 === 0 ? 1 : -1) * (offsetFactor * 3);
      baseCoordinates.x += esEquipoA ? shiftX : -shiftX;
      baseCoordinates.y += shiftY;
    }

    const clampedX = esEquipoA
      ? Math.max(4, Math.min(46, baseCoordinates.x))
      : Math.max(54, Math.min(96, baseCoordinates.x));

    const clampedY = Math.max(8, Math.min(92, baseCoordinates.y));

    return { left: `${clampedX}%`, top: `${clampedY}%` };
  }
}