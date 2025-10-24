import { BaseToast, ErrorToast } from "react-native-toast-message";

export const toastConfig = {
	success: (props: any) => (
		<BaseToast
			{...props}
			style={{
				borderLeftColor: "#22c55e",
				backgroundColor: "#f0fdf4",
				zIndex: 1000,
			}}
			contentContainerStyle={{ paddingHorizontal: 15 }}
			text1Style={{
				fontSize: 15,
				fontWeight: "600",
			}}
			text2Style={{
				fontSize: 13,
			}}
		/>
	),

	error: (props: any) => (
		<ErrorToast
			{...props}
			style={{
				borderLeftColor: "#ef4444",
				backgroundColor: "#fef2f2",
				zIndex: 1000,
			}}
			contentContainerStyle={{ paddingHorizontal: 15 }}
			text1Style={{
				fontSize: 15,
				fontWeight: "600",
			}}
			text2Style={{
				fontSize: 13,
			}}
		/>
	),

	info: (props: any) => (
		<BaseToast
			{...props}
			style={{
				borderLeftColor: "#3b82f6",
				backgroundColor: "#eff6ff",
				zIndex: 1000,
			}}
			contentContainerStyle={{ paddingHorizontal: 15 }}
			text1Style={{
				fontSize: 15,
				fontWeight: "600",
			}}
			text2Style={{
				fontSize: 13,
			}}
		/>
	),
};
