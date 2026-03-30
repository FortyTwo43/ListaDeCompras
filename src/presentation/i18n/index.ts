import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "noLists": "No shopping lists",
      "noItems": "No items yet",
      "noMeasures": "No measures yet",
      "lists": "Lists",
      "items": "Items",
      "measures": "Measures"
    }
  },
  es: {
    translation: {
      "noLists": "No hay listas de compras",
      "noItems": "No hay artículos añadidos",
      "noMeasures": "No hay medidas añadidas",
      "lists": "Listas",
      "items": "Artículos",
      "measures": "Medidas"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "es", // idioma por defecto
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
