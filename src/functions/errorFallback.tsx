const errorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  return (
    <div role="alert" className="text-center  mt-11">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <button
        aria-label="try again"
        onClick={() => resetErrorBoundary()}
        className="underline"
      >
        try again
      </button>
    </div>
  );
};

export default errorFallback;
