import React from "react";

const ErrorBoundary = ({ children  }: {children: React.ReactNode}) => {
  const [error, setError] = React.useState("");

  const promiseRejectionHandler = React.useCallback((event : any) => {
    setError(event.reason);
  }, []);

  const resetError = React.useCallback(() => {
    setError("");
  }, []);

  React.useEffect(() => {
    window.addEventListener("unhandledrejection", promiseRejectionHandler);

    return () => {
      window.removeEventListener("unhandledrejection", promiseRejectionHandler);
    };
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  return error ? (
    <React.Fragment>
      <h2>Something went wrong!</h2>
      <button type="button" onClick={resetError}>
        Try again
      </button>
    </React.Fragment>
  ) : (
    children
  );
};
//<h1 style={{ color: "red" }}>{error.toString()}</h1>
export default ErrorBoundary;