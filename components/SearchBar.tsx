import React from "react";
import { View, TextInput } from "react-native";
import { SearchIcon } from "@/constants/icons";

type SearchBarProps = {
	value: string;
	onChangeText: (text: string) => void;
};

const SearchBar = ({ value, onChangeText }: SearchBarProps) => {
	return (
		<View className="bg-neutral rounded-xl flex-row items-center px-4 py-3 border border-neutral-200">
			<SearchIcon width={20} height={20} />
			<TextInput
				value={value}
				onChangeText={onChangeText}
				placeholder="Search saved recipes..."
				placeholderTextColor="#959595"
				className="ml-3 flex-1 text-foreground"
			/>
		</View>
	);
};

export default SearchBar;
