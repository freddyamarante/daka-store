# Prueba Técnica: Freddy Amarante

Hola, un placer. Este proyecto consiste en la creación de un panel de visualización de productos que implementa diversas prácticas de desarrollo, como el consumo de APIs. Se utilizan las siguientes APIs:

* **Datos de Productos:** [https://fakestoreapi.com/](https://fakestoreapi.com/)
* **Tasa de Cambio del Bolívar Venezolano:** [https://pydolarve.org/](https://pydolarve.org/)

La interfaz de usuario presenta un diseño sencillo con tarjetas, facilitando la visualización de los productos y su información relevante. Cada tarjeta enlaza a una página individual, donde se puede apreciar el efecto de las transiciones proporcionado por Vue Router.

Entre las funcionalidades se incluye el filtrado de productos en tiempo real por categorías y rango de precios. Además, se permite ajustar dinámicamente la moneda principal en la que se visualizan los precios. Aunque el precio base está en USD, la aplicación consulta la tasa de cambio BCV actual a través de la API de AlCambio para realizar la conversión y mostrar los precios en Bolívares.

## Instalación

Para ejecutar este proyecto localmente, por favor siga los siguientes pasos:

1.  **Clone el repositorio de Git** en su computador.
2.  **Abra su terminal** y navegue al directorio del proyecto.
3.  **Instale las dependencias** utilizando el siguiente comando:
    ```bash
    pnpm install
    ```
4.  **Inicie el servidor de desarrollo** con el comando:
    ```bash
    pnpm run dev
    ```
5.  **Abra su navegador web** y navegue a [http://localhost:5173/](http://localhost:5173/).

## Consideraciones Técnicas

* **Framework:** El proyecto se construyó utilizando la plantilla base de Vite, que emplea Vue 3.
* **Estilos:** Se utiliza Tailwind CSS para el diseño de la interfaz de usuario.
* **Cliente HTTP:** Axios se utiliza para realizar las peticiones a las APIs.
* **Gestión de Estado:** Se optó por Pinia para la gestión del estado con el fin de mantener un código más limpio y evitar la propagación de props entre componentes. Esto es especialmente útil dada la naturaleza interactiva de los paneles de filtros y configuración y su interacción directa con la interfaz de productos.
* **Componentes Personalizados:** Se desarrollaron varios componentes desde cero, como `PaginationControls` y `RangeSlider`. Si bien generalmente se prefiere utilizar librerías de componentes probadas para este tipo de funcionalidades, se tomó esta decisión para practicar la implementación de estas características y demostrar el manejo de los cambios de parámetros en tiempo real.