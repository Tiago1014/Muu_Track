export type Categoria = 'ternero' | 'novillo' | 'vaquillona' | 'vaca'
export type Sexo = 'macho' | 'hembra'
export type Potrero = 'Potrero del Monte' | 'La Cañada' | 'El Bajo' | 'Potrero Chico'
export type Nota = 'Vacunado' | 'Desparasitado' | 'Rengo' | 'Preñada' | 'Otro'
export type Grupo = 'listo' | 'creciendo' | 'atrasado'

export interface Pesaje {
  fecha: string // AAAA-MM-DD
  kg: number
  notas: Nota[]
}

export interface Animal {
  caravana: number
  categoria: Categoria
  sexo: Sexo
  edadMeses: number
  potrero: Potrero
  descarte: boolean // solo tiene sentido en vacas
  pesajes: Pesaje[] // ordenados de más viejo a más nuevo
}

export const POTREROS: Potrero[] = ['Potrero del Monte', 'La Cañada', 'El Bajo', 'Potrero Chico']
export const NOTAS: Nota[] = ['Vacunado', 'Desparasitado', 'Rengo', 'Preñada', 'Otro']
