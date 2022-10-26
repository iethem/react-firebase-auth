import React from "react";
import {
  Link,
  useNavigate,
  useLocation,
  BrowserRouter as Router,
  Routes,
  Navigate,
  Route,
} from "react-router-dom";
import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import { useAuth, getFirebaseAuth } from "./auth/use-auth";

const firebaseAuth = getFirebaseAuth();

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
    GoogleAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};

function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { from } = location.state || { from: { pathname: "/" } };

  if (auth.user) {
    navigate(from, { replace: true });
  }
  return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseAuth} />;
}

function Account() {
  const auth = useAuth();

  return (
    <>
      <p>
        Welcome <Link to="/account">{auth.user.displayName}</Link>
      </p>
      <button type="button" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    </>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/account"
          element={
            <RequireAuth>
              <Account />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
