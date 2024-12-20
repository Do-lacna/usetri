import { Redirect, useRootNavigationState } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Formik } from "formik";
import React from "react";
import { Text, View } from "react-native";
import * as Yup from "yup";
import { auth } from "~/firebase.config";
import { Button } from "../components/ui/button";
import { GoogleSignIn } from "../components/ui/google-sign-in";
import { Input } from "../components/ui/input";
import { useSession } from "../context/authentication-context";

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email address"),
  password: Yup.string().required("Please enter valid password"),
});

export default function SignIn() {
  const [isLoading, setIsLoading] = React.useState(false);
  const rootNavigationState = useRootNavigationState();
  const { user } = useSession();

  const performSignIn = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      // await createUserWithEmailAndPassword(
      //   auth,
      //   values?.email,
      //   values?.password
      // );

      await signInWithEmailAndPassword(auth, values?.email, values?.password);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!rootNavigationState?.key) return null;

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (user) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/" />;
  }

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={SignupSchema}
      onSubmit={(values, { resetForm }) => {
        performSignIn(values);
        resetForm();
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        touched,
        errors,
      }) => (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <GoogleSignIn />
          <Input
            placeholder="Write some stuff..."
            aria-labelledby="inputLabel"
            aria-errormessage="inputError"
            className="mt-4 w-[80%]"
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            value={values.email}
          />
          {touched.email && errors.email && (
            <Text className="my-4 text-red-600">{errors.email}</Text>
          )}
          <Input
            placeholder="Write some stuff..."
            aria-labelledby="inputLabel"
            aria-errormessage="inputError"
            className="mt-4 w-[80%]"
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
          />
          {touched.password && errors.password && (
            <Text className="my-4 text-red-600">{errors.password}</Text>
          )}

          <Button>
            <Text
              onPress={() => {
                handleSubmit();
              }}
            >
              Sign In
            </Text>
          </Button>
        </View>
      )}
    </Formik>
  );
}
