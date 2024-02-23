const EmptyUi = ({ message, src }: { message: string; src: string }) => {
  return (
    <div className="text-center">
      <img
        className="w-full"
        src={src}
        alt="no followings"
        width={600}
        height={400}
      />
      <h1 className="font-medium">{message}</h1>
    </div>
  );
};

export default EmptyUi;
