export function getTitle () {
    console.log(import.meta.env.VITE_APP_NAME)
    return import.meta.env.VITE_APP_NAME ? import.meta.env.VITE_APP_NAME: 'Formaptix';
}