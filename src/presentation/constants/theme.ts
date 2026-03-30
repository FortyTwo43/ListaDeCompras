export const Colors = {
  light: {
    background: '#F5F5F9', // color de fondo claro
    surface: '#FFFFFF', // color de las tarjetas (card)
    text: '#202020',
    textSecondary: '#666666',
    border: '#E0E0E0',
    primary: '#6A6385', // Violeta apagado como el de las capturas para FABs
    primaryLight: '#8A82A5', 
    success: '#00B578', // check verde
    danger: '#FF4D4F', // cross rojo
    pending: '#808080', // circulo gris
  },
  dark: {
    background: '#13131A', // Fondo oscuro de las capturas
    surface: '#1C1C24', // Barra inferior y detalles
    surfaceHighlight: '#A8A6B9', // Gris claro o lavanda para las tarjetas de listas vacias/llenas
    text: '#EFEFEF',
    textSecondary: '#A0A0A0',
    border: '#2A2A35',
    primary: '#474358', // FAB background de la captura
    primaryLight: '#605B77',
    success: '#07C160', // check verde (captura de progreso y estado)
    danger: '#E64340', // tachado
    pending: '#555555', // circulo oscuro
  }
};

export const Radii = {
  sm: 6,
  md: 12, // bordes levemente redondeados como en las capturas
  lg: 16,
  xl: 20,
  round: 9999,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
