import { useState } from "react";
import { Link } from "react-router-dom";
import FloatingInput from "../components/FloatingInput";
import useLogin from "../hooks/useLogin";
import Button from "../components/Button";

function Signin() {
  const { login, isLoading, error } = useLogin();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData, rememberMe);
  };

  return (
    <div>
      <section className="bg-gray-50">
        <div className="mx-auto flex min-h-dvh w-full flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:py-0">
          <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                Sign in to your account
              </h1>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <FloatingInput
                    id="email"
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />              
                </div>

                <div>
                  

                  <FloatingInput
                    id="password"
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300  focus:ring-primary-600 ring-offset-gray-800"
                      />
                    </div>

                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="remember"
                        className="text-gray-500"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary-600 hover:underline text-blue-300"
                  >
                    Forgot password?
                  </Link>
                </div>

                {error && (
                  <p className="text-sm text-red-500" role="alert">
                    failed to sign in, pleace try again
                  </p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={isLoading}
                  disabled={isLoading}
                  className="min-h-11 w-full"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>

                <p className="text-sm font-light text-gray-200">
                  Don’t have an account yet?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-primary-600 hover:underline text-blue-500"
                  >
                    Sign up
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

export default Signin;
