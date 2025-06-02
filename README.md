# Vue Pokedex

Welcome to the Vue Pokedex project! This application is an interactive Pokedex developed with Vue.js.

## Technologies Used

This project utilizes the following key technologies and dependencies:

* **Vue.js 3.x**: A progressive JavaScript framework for building user interfaces.
* **Pinia 3.x**: The intuitive and lightweight state management store for Vue.js.
* **Vue Router 4.x**: The official router for Vue.js, enabling smooth navigation between pages.
* **PrimeVue 4.x** and **@primeuix/themes 1.x**: A rich UI component library for Vue.js, along with its themes.
* **Tailwind CSS 4.x**: A utility-first CSS framework for rapid and customizable styling.
* **Alova 3.x**: A lightweight and high-performance HTTP request library.
* **Vite 6.x**: A next-generation build tool that offers an extremely fast development experience.
* **TypeScript 5.x**: A typed superset of JavaScript that compiles to plain JavaScript.
* **Playwright 1.x**: A powerful browser automation framework for robust end-to-end testing (used in development).

## Installation

To run the project locally, follow the steps below:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/usualpro/vue-pokedex
    cd vue-pokedex
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

## Available Scripts

In the project directory, you can run the following commands:

* **`npm run dev`**: Starts the application in development mode.
    Opens your browser to `http://localhost:5173` (or a similar port) to view the application. Hot reloading is enabled. **Note: For end-to-end tests to function correctly, the development server must be running on port `5173`.**

* **`npm run build`**: Builds the application for production to the `dist` folder.
    This script compiles the TypeScript code and optimizes the application for deployment.

* **`npm run preview`**: Serves the built application locally.
    Allows you to preview the production version of your application before deploying it.

* **`npx playwright test --ui`**: Launches end-to-end tests with the Playwright UI.
    This will open the Playwright test runner, allowing you to interactively view, debug, and re-run tests.

## Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/my-awesome-feature`).
3.  Make your changes and commit them (`git commit -m 'Add an awesome feature'`).
4.  Push to the branch (`git push origin feature/my-awesome-feature`).
5.  Open a Pull Request.
