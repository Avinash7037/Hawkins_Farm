import AuthLayout from "../components/AuthLayout";
import RegisterForm from "../components/RegisterForm";

function Register() {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join Hawkins Farm and connect with fresh farm products."
    >
      <RegisterForm />
    </AuthLayout>
  );
}

export default Register;
