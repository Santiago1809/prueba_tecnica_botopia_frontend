export interface Stats {
  cards: Card[];
  ventasRecientes: VentasReciente[];
  datosMensuales: DatosMensuales;
}

export interface Card {
  title: string;
  value: number;
  type: "Ingresos" | "Ventas" | "Clientes";
}

export interface VentasReciente {
  id: number;
  documentId: string;
  TotalPrice: number;
  createdAt: string;
  user: User;
}

export interface User {
  id: number;
  documentId: string;
  display_name: string;
  email: string;
}

export interface DatosMensuales {
  Ene: number;
  Feb: number;
  Mar: number;
  Abr: number;
  May: number;
  Jun: number;
  Jul: number;
  Ago: number;
  Sep: number;
  Oct: number;
  Nov: number;
  Dic: number;
}
