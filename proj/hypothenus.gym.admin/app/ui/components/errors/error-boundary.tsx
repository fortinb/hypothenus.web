
"use client"

import Image from 'next/image';
import React from 'react';
import Container from "react-bootstrap/Container";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { debugLog } from "@/app/lib/utils/debug";

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState("");
  const t = useTranslations("layout");

  const promiseRejectionHandler = useCallback((event: any) => {
    if (event?.reason?.digest?.startsWith("NEXT_REDIRECT")) {
      throw event.reason
    }
    
    setError(event.reason);
    debugLog("Error: ", event.reason);
  }, []);

  const resetError = useCallback(() => {
    setError("");
    window.location.href = "/";
  }, []);

  useEffect(() => {
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