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
      "measures": "Measures",
      "settings": "Settings",
      "darkTheme": "Dark Mode",
      "language": "Language",
      "english": "English",
      "spanish": "Spanish",
      "edit": "Edit",
      "delete": "Delete",
      "deleteListConfirm": "Are you sure you want to delete the list \"{{name}}\" and all its items?",
      "newMeasure": "New Measure",
      "editMeasure": "Edit Measure",
      "newList": "New List",
      "editList": "Edit List",
      "newItem": "New Item",
      "editItem": "Edit Item",
      "save": "Save",
      "cancel": "Cancel",
      "title": "Title",
      "description": "Description",
      "optional": "optional",
      "icon": "Icon",
      "color": "Color",
      "placeholderMeasure": "e.g. Kilograms, Meters...",
      "placeholderItem": "e.g. Rice, Milk, Bread...",
      "placeholderList": "e.g. Supermarket",
      "errorTitleRequired": "Name is required",
      "errorTitleListRequired": "Title is required",
      "errorSelectionRequired": "You must select an icon and a color",
      "errorQuantityRequired": "Quantity must be greater than 0",
      "errorMeasureRequired": "You must select a unit of measure",
      "deleteItemConfirm": "Are you sure you want to delete \"{{name}}\" from the catalog?",
      "addItems": "Add items",
      "quantity": "Quantity",
      "measure": "Measure",
      "addToList": "Add to list",
      "deleteFromList": "Remove from list",
      "deleteFromListConfirm": "Are you sure you want to remove \"{{name}}\" from this list?",
      "changeStatus": "Change Status",
      "chooseStatusFor": "What status do you want for \"{{name}}\"?",
      "pendiente": "Pending",
      "comprado": "Bought",
      "cancelado": "Cancelled",
      "dbErrorTitle": "Configuration Error",
      "dbErrorMessage": "There was a problem configuring your data. Please restart the application.",
      "search": "Search..."
    }
  },
  es: {
    translation: {
      "noLists": "No hay listas de compras",
      "noItems": "No hay artículos añadidos",
      "noMeasures": "No hay medidas añadidas",
      "lists": "Listas",
      "items": "Artículos",
      "measures": "Medidas",
      "settings": "Configuración",
      "darkTheme": "Tema Oscuro",
      "language": "Idioma",
      "english": "Inglés",
      "spanish": "Español",
      "newMeasure": "Nueva Medida",
      "editMeasure": "Editar Medida",
      "newList": "Nueva Lista",
      "editList": "Editar Lista",
      "newItem": "Nuevo Artículo",
      "editItem": "Editar Artículo",
      "save": "Guardar",
      "cancel": "Cancelar",
      "title": "Título",
      "description": "Descripción",
      "optional": "opcional",
      "icon": "Icono",
      "color": "Color",
      "placeholderMeasure": "Ej. Kilogramos, Metros...",
      "placeholderItem": "Ej. Arroz, Leche, Pan...",
      "placeholderList": "Ej. Supermercado",
      "errorTitleRequired": "El nombre es obligatorio",
      "errorTitleListRequired": "El título es obligatorio",
      "errorSelectionRequired": "Debe seleccionar un ícono y un color",
      "errorQuantityRequired": "La cantidad debe ser mayor a 0",
      "errorMeasureRequired": "Debe seleccionar una unidad de medida",
      "delete": "Eliminar",
      "edit": "Editar",
      "deleteListConfirm": "¿Estás seguro que deseas eliminar la lista \"{{name}}\" y todos sus artículos?",
      "deleteMeasureConfirm": "¿Estás seguro que deseas eliminar la unidad \"{{name}}\"?",
      "deleteItemConfirm": "¿Estás seguro que deseas eliminar \"{{name}}\" del catálogo?",
      "addItems": "Agregar artículos",
      "quantity": "Cantidad",
      "measure": "Medida",
      "addToList": "Añadir a la lista",
      "deleteFromList": "Quitar de la lista",
      "deleteFromListConfirm": "¿Estás seguro que deseas quitar \"{{name}}\" de esta lista?",
      "changeStatus": "Cambiar Estado",
      "chooseStatusFor": "¿A qué estado deseas cambiar \"{{name}}\"?",
      "pendiente": "Pendiente",
      "comprado": "Comprado",
      "cancelado": "Cancelado",
      "dbErrorTitle": "Error de Configuración",
      "dbErrorMessage": "Hubo un problema al configurar tus datos. Por favor, reinicia la aplicación.",
      "search": "Buscar..."
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
