import React from 'react';
import ReactDOM from 'react-dom/client';
import Button from './components/Button';
import Card from './components/Card';
import Login from './components/Login';

// Standalone app for development/testing
const App = () => (
  <div style={{ padding: '20px' }}>
    <h1>Remote Components App</h1>
    
    <div style={{ marginBottom: '20px' }}>
      <Login />
    </div>
    
    <Card title="Sample Card">
      <p>This is a sample card component</p>
      <Button onClick={() => alert('Clicked!')}>
        Click me
      </Button>
    </Card>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);