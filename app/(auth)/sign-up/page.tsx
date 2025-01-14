"use client";

import AuthForm from "@/components/auth-form";
import { signup } from "@/lib/actions/auth";
import { SignUpSchema } from "@/lib/validations";

const SignUp = () => {
  return (
    <AuthForm
      type="SIGN_UP"
      schema={SignUpSchema}
      defaultValues={{
        email: "",
        password: "",
        fullName: "",
        universityId: 0,
        universityCard: "",
      }}
      onSubmit={signup}
    />
  );
};

export default SignUp;
