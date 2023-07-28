import { defaultConfig } from 'next/dist/server/config-shared';

const Button = (props) => {
  const { text = 'Soumettre', type = 'default' } = props;
  const defaultStyle =
    'relative inline-flex items-center justify-center font-medium rounded-full text-sm p-0.5 mb-3 text-white group bg-gradient-to-br from-secondary to-carbon-blue group-hover:from-secondary group-hover:carbon-blue ';
  return (
    <button
      className={
        type === 'danger'
          ? defaultStyle + 'bg-secondary hover:bg-red-700'
          : type === 'active'
          ? defaultStyle + 'bg-carbon-green hover:bg-carbon-green border-none'
          : defaultStyle
      }
      {...props}
    >
      <span className='px-5 py-2.5 bg-primary rounded-full transition-all ease-in duration-75 group-hover:bg-opacity-0'>
        {text}
      </span>
    </button>
  );
};

export default Button;
