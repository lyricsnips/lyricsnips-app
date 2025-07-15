import { useAuthModal } from "@/contexts/AuthModalContext";
import LogInForm from "@/components/features/LogInForm";
import SignUpForm from "./SignUpForm";

export default function AuthModal() {
  const { isOpen, closeModal, tab, setTab } = useAuthModal();

  return (
    <>
      {isOpen && (
        <div>
          <button type="button" onClick={closeModal}>
            Close
          </button>
          <h1>Log In or Sign Up</h1>
          <button onClick={() => setTab("login")}>Login</button>
          <button onClick={() => setTab("signup")}>Sign Up</button>
          {tab === "login" && <LogInForm />}
          {tab === "signup" && <SignUpForm />}
        </div>
      )}
    </>
  );
}
