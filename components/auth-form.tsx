"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { FieldValues } from "react-hook-form";
import { z, ZodType } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import ImageUpload from "./image-upload";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type TFormType = "SIGN_IN" | "SIGN_UP";
interface IAuthForm<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: TFormType;
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: IAuthForm<T>) => {
  // Init form
  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const router = useRouter();

  const isSignIn = type === "SIGN_IN";

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const { success, error } = await onSubmit(data);

    if (error) {
      toast({
        title: `Error ${isSignIn ? "signing in" : "signing up"}`,
        description: error ?? "An error occurred",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: isSignIn
          ? "You have successfully signed in"
          : "you have successfuull signed up",
      });

      router.push("/");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">
        {isSignIn ? "Welcome back to BookWise" : "Create your library account"}
      </h1>

      <p className="text-light-100">
        {isSignIn
          ? "Access the vast collection of resources, and stay updated"
          : "Please complete all fields and upload a valid university ID to gain access to the library."}
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full space-y-6"
        >
          {Object.keys(defaultValues).map((fields) => (
            <FormField
              key={fields}
              control={form.control}
              name={fields as Path<T>}
              render={({ field }) => (
                <FormItem>
                  {/* Label of the form goes here */}
                  <FormLabel className="capitalize">
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                  </FormLabel>

                  {/* All Form inputs goes here */}
                  <FormControl>
                    {field.name === "universityCard" ? (
                      <ImageUpload onFileChange={field.onChange} />
                    ) : (
                      <Input
                        required
                        type={
                          FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                        }
                        {...field}
                        className="form-input"
                      />
                    )}
                  </FormControl>

                  {/* Form description and message goes here */}
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="submit" className="form-btn">
            {isSignIn ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-base font-medium">
        {isSignIn ? "New to BookWise? " : "Already have an account? "}
        <Link
          className="font-bold text-primary"
          href={isSignIn ? "/sign-up" : "/sign-in"}
        >
          {isSignIn ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
