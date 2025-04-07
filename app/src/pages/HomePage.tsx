
import { useState } from "react";
import { LoginForm } from "../features/authentication/LoginForm/LoginForm";
import { SignUpForm } from "../features/authentication/SignUpForm/SignUpForm";
import { User } from "../models/User";

interface HomePageProps {
  updateLoggedInUser(user: User): void;
}

const HomePage: React.FC<HomePageProps> = ({ updateLoggedInUser }) => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96 space-y-4">
        {showLogin ? (
          <LoginForm updateLoggedInUser={updateLoggedInUser} switchToSignUp={() => setShowLogin(false)} />
        ) : (
          <SignUpForm
            switchToLogin={() => {
            //   alert("You've been registered! Please log in.");
              setShowLogin(true);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;