import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { useToastResult } from './useToastResult';

// small test component to exercise the hook behaviour without extra deps
function HookTester() {
  const { resultStatus, showResult, resultText, resultErrorTextCode, showResultToast, toggleShowResult } = useToastResult();

  return (
    <div>
      <div data-testid="status">{String(resultStatus)}</div>
      <div data-testid="show">{String(showResult)}</div>
      <div data-testid="text">{resultText}</div>
      <div data-testid="err">{resultErrorTextCode}</div>
      <button onClick={() => showResultToast(true, 'OK')}>success</button>
      <button onClick={() => showResultToast(false, 'Fail', 'network')}>fail</button>
      <button onClick={() => toggleShowResult()}>hide</button>
    </div>
  );
}

describe('useToastResult hook (component integration)', () => {
  it('shows success and error flows', () => {
    render(<HookTester />);

    // initially hidden
    expect(screen.getByTestId('show').textContent).toBe('false');

    fireEvent.click(screen.getByText('success'));
    expect(screen.getByTestId('status').textContent).toBe('true');
    expect(screen.getByTestId('text').textContent).toBe('OK');
    expect(screen.getByTestId('show').textContent).toBe('true');

    fireEvent.click(screen.getByText('fail'));
    expect(screen.getByTestId('status').textContent).toBe('false');
    expect(screen.getByTestId('text').textContent).toBe('Fail');
    expect(screen.getByTestId('err').textContent).toBe('network');

    fireEvent.click(screen.getByText('hide'));
    expect(screen.getByTestId('show').textContent).toBe('false');
  });
});
