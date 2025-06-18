import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ClientListPage from './pages/ClientListPage';
import AddClientPage from './pages/AddClientPage';
import EditClientPage from './pages/EditClientPage';
import './styles/globals.css'; // Import global styles

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={ClientListPage} />
        <Route path="/add" component={AddClientPage} />
        <Route path="/edit/:id" component={EditClientPage} />
      </Switch>
    </Router>
  );
};

export default App;