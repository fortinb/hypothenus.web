"use client";

import { useState, useCallback } from "react";

export function useToastResult() {

  const [resultStatus, setResultStatus] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultText, setResultText] = useState("");
  const [resultErrorTextCode, setResultErrorTextKey] = useState("");

  const toggleShowResult = useCallback(() => {
    setShowResult(false);
  }, []);

  const showResultToast = useCallback(
    (success: boolean, text: string, errorTextKey?: string) => {
      setResultStatus(success);
      setResultText(text);

      if (!success && errorTextKey) {
        setResultErrorTextKey(errorTextKey);
      } else {
        setResultErrorTextKey("");
      }

      setShowResult(true);
    },
    []
  );

  return {
    // state (passed to ToastResult)
    resultStatus,
    showResult,
    resultText,
    resultErrorTextCode,

    // actions
    showResultToast,
    toggleShowResult
  };
}