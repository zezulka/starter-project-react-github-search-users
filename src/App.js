import React from "react";
import { Dashboard, Login, PrivateRoute, AuthWrapper, Error } from "./pages";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <AuthWrapper>
      <Router>
        <Switch>
          <PrivateRoute exact path="/">
            <Dashboard></Dashboard>
          </PrivateRoute>
          <Route exact path="/login">
            <Login></Login>
          </Route>
          <Route>
            <Error></Error>
          </Route>
        </Switch>
      </Router>
    </AuthWrapper>
  );
}

export default App;
