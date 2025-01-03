import { useTranslation } from '@/app/i18n/i18n';
import Image from 'next/image';
import React from "react";
import Container from "react-bootstrap/Container";

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = React.useState("");
  const { t } = useTranslation("layout");

  const promiseRejectionHandler = React.useCallback((event: any) => {
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
      <Container fluid="true" className="h-100 w-100">
        <div className="d-flex flex-row h100 w-100 justify-content-between">
          <div className="w-50">
            <Image
              src="/images/error_page.jpg"
              width={800}
              height={900}
              alt="Hypothenus"
            />
          </div>
          <div className="w-50">
            <h3>{t("error.boundary.title")}</h3>
            <button className="btn btn-primary" type="button" onClick={resetError}>
            {t("error.boundary.action")}
            </button>
          </div>
        </div>
      </Container>
    </React.Fragment>
  ) : (
    children
  );
};

export default ErrorBoundary;