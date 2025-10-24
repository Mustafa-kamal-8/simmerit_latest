import { router } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

export const AuthContext = createContext({
	isMounted: false,
	setIsMounted: (value: boolean) => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [isMounted, setIsMounted] = useState(false);

	return <AuthContext.Provider value={{ isMounted, setIsMounted }}>{children}</AuthContext.Provider>;
};

const useLoginPage = () => {
	const { isMounted, setIsMounted } = useContext(AuthContext);

	useEffect(() => {
		if (isMounted && Platform.OS === "android") {
			router.back();
		}
	}, [isMounted]);

	return {
		isMounted,
		setIsMounted,
	};
};

export default useLoginPage;
