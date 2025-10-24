/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				primary: {
					light: "#34A853",
					dark: "#0F9D58",
					fade: "#36655F",
					DEFAULT: "#053828",
				},
				secondary: {
					DEFAULT: "#FF0050",
				},
				background: {
					DEFAULT: "#F6F6F6",
					dark: "#000000",
				},
				foreground: {
					DEFAULT: "#2D2D2D",
					light: "#E5E5E5",
					dark: "#181818",
					secondary: "#959595",
				},
				neutral: {
					DEFAULT: "#FFFFFF",
					dark: "#000000",
				},
			},
			flex: {
				1.5: "1.5 1.5 0%",
				2.5: "2.5 2.5 0%",
				3.5: "3.5 3.5 0%",
			},
		},
	},
	plugins: [],
};
