import React from 'react';
import './App.css';
import NavigationBar from './components/NavigationBar'; // Adjust path if needed
import AppRoutes from './routes/AppRoutes'; // Adjust path if needed

function App() {
  return (
    <div className="App">
      <NavigationBar />
      <main>
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
