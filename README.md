# A React ECS Game Engine Written in TypeScript

This project is a React application that utilizes an Entity Component System
(ECS) architecture to manage and render entities in a 2D space using p5.js. The
ECS pattern is commonly used in game development for its flexibility and
efficiency in managing game entities and their behaviors.

## Entity Component System (ECS)

### Entities

Entities are unique identifiers (strings) that are used to look up associated
components. In this implementation, entities are represented as UUID strings.

### Components

Components are data containers that hold specific attributes of entities.

#### isDirty Flag

Each component has an `isDirty` flag that indicates whether the component has
been modified and needs to be updated. This flag is used to optimize the system
updates by only processing entities with components that have changed.
Components should set this flag to `true` whenever their state changes, and it
can be reset using the `resetDirty` method.

### Systems

Systems contain the logic that operates on entities with specific components.

## React Integration

The React application is structured to integrate with p5.js using the
`ReactP5Wrapper`. The main application component, `App`, is responsible for
initializing and rendering the p5.js sketch. The `App` component also ensures
that the canvas resizes with the window and clears the background each frame.

## p5.js Integration

The p5.js library is used for rendering and animation. The `sketch` function
sets up the canvas and updates the ECS each frame. The `setup` function
initializes the canvas, and the `draw` function clears the background and
updates the ECS.

## Running

Run in the browser with:

```
$ npm install
$ npm start
```

## Consuming

To use the ECS Demo in your own React project, import the `ecs` folder which
includes the `ECSDemo` component along with the ECS implementation.

Dependencies:

```json
"@p5-wrapper/react": "4.x",
```

DevDependencies:

```json
"@types/p5": "1.x",
```

Import the `ECSDemo` component:

```tsx
import ECSDemo from './ecs/ECSDemo';
```

Then, you can include the `ECSDemo` component in your JSX:

```tsx
<div id='ecs-demo'></div>
  <ECSDemo transparency={1} />
</div>
```

Note the parent div of _ecs-demo_ must be of type <code>position:
relative;</code> and have a width and height specified for the canvas to render
correctly.

The optional <code>transparency</code> prop can be adjusted from 0 (fully
transparent) to 1 (fully opaque) to control the visibility of the ECS demo
canvas. Default is 1.
