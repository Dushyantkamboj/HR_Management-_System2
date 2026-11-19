export default function DividerHeading({ text = "HR Management System" }) {
  return (
    <div className="flex w-full max-w-xs items-center sm:max-w-sm">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="mx-4 text-gray-500 text-sm font-medium whitespace-nowrap">
        {text}
      </span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
}