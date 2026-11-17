# Miura Casta · Landing

Página única e interactiva (`index.html`) con la línea gráfica del Brand Book de Miura Holdings.
No necesita servidor ni instalación: todo el código, el logo y los datos van dentro del archivo.

## Verla

Abra `index.html` con doble clic en cualquier navegador.

## Contacto

Al inicio del `<script>`, complete `CONTACT`:

```js
const CONTACT = {
  whatsapp: "18095551234",   // solo dígitos, con código de país
  email: "correo@ejemplo.com"
};
```

Si se dejan vacíos, la sección de contacto pide responder al mensaje con el que se recibió el enlace.

## Publicarla

Cualquier hosting estático sirve. Por ejemplo, arrastre esta carpeta a Netlify Drop (app.netlify.com/drop)
o impórtela en Vercel con esta carpeta como Root Directory. La página no se indexa en buscadores
(`noindex`), pero cualquiera con el enlace puede abrirla.

## Datos

La trayectoria (TWR de la cuenta en Interactive Brokers frente al QQQ) está fijada al 16 de noviembre de 2026.
