"use client";

import AuthForm from "@/components/auth-form";
import { SignInSchema } from "@/lib/validations";

const SignIn = () => (
  <AuthForm
    type="SIGN_IN"
    schema={SignInSchema}
    defaultValues={{
      email: "",
      password: "",
    }}
    onSubmit={() => {}}
  />
);

export default SignIn;
