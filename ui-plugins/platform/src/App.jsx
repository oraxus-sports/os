import React, { Suspense } from 'react';

// Import remote components
const RemoteButton = React.lazy(() => import('remoteComponents/Button'));
const RemoteCard = React.lazy(() => import('remoteComponents/Card'));
const RemoteLogin = React.lazy(() => import('remoteComponents/Login'));

const App = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Host Application</h1>
      
      {/* <Suspense fallback={<div>Loading Remote Components...</div>}>
        <RemoteCard title="Remote Card from Microfrontend">
          <p>This card is loaded from the remote components microfrontend!</p>
          
          <RemoteButton 
            variant="primary" 
            onClick={() => alert('Remote button clicked!')}
          >
            Remote Button
          </RemoteButton>
          
          <RemoteButton 
            variant="secondary" 
            onClick={() => console.log('Secondary button clicked!')}
          >
            Secondary Remote Button
          </RemoteButton>
        </RemoteCard>
      </Suspense> */}

      <Suspense fallback={<div>Loading Remote Login...</div>}>
        <RemoteLogin />
      </Suspense>

      {/* Local components */}
      {/* <div style={{ marginTop: '20px' }}>
        <h2>Local Host Components</h2>
        <button onClick={() => alert('Local button!')}>
          Local Button
        </button>
      </div> */}
    </div>
  );
};

export default App;