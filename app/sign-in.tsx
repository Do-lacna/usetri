import auth, { signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { Formik } from "formik";
import { useState } from "react";
import { Text, View } from "react-native";
import * as Yup from "yup";
import { Button } from "../components/ui/button";
import { GoogleSignIn } from "../components/ui/google-sign-in";
import { Input } from "../components/ui/input";

const SignupSchema = Yup.object().shape({
	email: Yup.string()
		.email("Invalid email")
		.required("Please enter your email address"),
	password: Yup.string().required("Please enter valid password"),
});

export default function SignIn() {
	const [isLoading, setIsLoading] = useState(false);

	const performSignIn = async (values: { email: string; password: string }) => {
		setIsLoading(true);
		try {
			await signInWithEmailAndPassword(auth(), values?.email, values?.password);
		} catch (e) {
			console.error(e);
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return <Text>Loading...</Text>;
	}

	return (
		<Formik
			initialValues={{ email: "", password: "" }}
			validationSchema={SignupSchema}
			onSubmit={async (values, { resetForm }) => {
				await performSignIn(values);
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
