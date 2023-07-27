import { defaultConfig } from "next/dist/server/config-shared";

const Button = props => {
  const { text = "Soumettre", type = "default" } = props;
  const defaultStyle =
    "  font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:text-white bg-transparent border border-gray-400 hover:bg-carbon-blue ";
  return (
    <button
      className={
        type === "danger"
          ? defaultStyle + "dark:bg-secondary dark:hover:bg-red-700 border-none"
          : type === "active"
          ? defaultStyle +
            "dark:bg-carbon-green dark:hover:bg-carbon-green border-none"
          : defaultStyle
      }
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
