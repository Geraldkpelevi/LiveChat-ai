import { useState } from "react";
import { Link } from "react-router-dom";
import useSignup from "../hooks/useSignup";
import FloatingInput from "../components/FloatingInput";
import Button from "../components/Button";

function Signup() {
  const { signup, isLoading, error } = useSignup();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(formData);
  };

  return (
    <div>
      <section className="bg-gray-50">
        <div className="mx-auto flex min-h-dvh w-full flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:py-0">
          <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight  md:text-2xl text-white">
                Sign up
              </h1>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <FloatingInput
                    label="Your name"
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>

                <div>

                  <FloatingInput
                    label="Your email"
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                   
                </div>

                <div>
                  

                  <FloatingInput
                    label="Password"
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </div>

                <div>
                  
                  <FloatingInput
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500 ">
                    Password must be at least 8 characters.
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-red-500" role="alert">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="primary"
                  size="md"
                  fullWidth
                  loading={isLoading}
                >
                  {isLoading ? "Creating account..." : "Sign up"}
                </Button>

                <p className="text-sm font-light text-gray-200 ">
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="font-medium text-primary-600 hover:underline text-blue-500"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Signup;
