import { defaultConfig } from "next/dist/server/config-shared";

const Button = props => {
  const { text = "Soumettre", type = "default" } = props;
  const defaultStyle =
    "  font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:text-white dark:bg-primary ";
  return (
    <button
      className={
        type === "danger"
          ? defaultStyle + "dark:bg-secondary dark:hover:bg-secondary"
          : type === "active"
          ? defaultStyle + "dark:text-white dark:bg-green-800"
          : type === "transparent"
          ? defaultStyle + "dark:text-white"
          : defaultStyle
      }
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
