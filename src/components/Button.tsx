interface ButtonProps {
    text: string;
    onClick: () => void;
    isSelected: boolean;
  }
  
  export default function Button({ text, onClick, isSelected }: ButtonProps) {
    return (
      <button
        onClick={onClick}
        className={`block w-full p-2 my-2 text-left border rounded-lg ${
          isSelected ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        {text}
      </button>
    );
  }
  