interface Props {
  options: { value: string; name: string }[];
  value: string;
  onChange: (value: string) => void;
}

export function DropdownMenu({ options, value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 rounded-md bg-gray-700 text-white focus:ring focus:ring-blue-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  );
}
