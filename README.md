# Rafflesia

## Run locally

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Create new tool
* Add tool name to the array in `src/tool-registry.ts`
* Update the map in `app.component.ts`
* Create a component in the `tools/` directory
    * `yarn ng generate component tools/your-tool`
* Update the toolbar in `app.component.html`