import { useNavigate } from "react-router-dom";

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  const Navigate = useNavigate();

  return (
    <div role="alert" className="text-center  mt-11">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <button
        aria-label="try again"
        onClick={() => {
          Navigate("/");
          resetErrorBoundary();
        }}
        className="underline"
      >
        try again
      </button>
    </div>
  );
};

export default ErrorFallback;
