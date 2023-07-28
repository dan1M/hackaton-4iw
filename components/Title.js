export default function Title(props) {
  const { text } = props;
  return (
    <h1
      className='text-white text-4xl font-bold text-center relative '
      {...props}
    >
      {text}
      <div className='h-1 bg-gradient-to-br from-secondary to-carbon-blue w-16 mx-auto '></div>
    </h1>
  );
}
