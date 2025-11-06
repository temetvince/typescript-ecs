import ECSDemo from './ecs/ECSDemo';
import React from 'react';

import './App.css';

export default function App() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black',
        zIndex: 0,
      }}
    >
      <div id='ecs-demo'>
        <ECSDemo transparency={1} />
      </div>
    </div>
  );
}
