import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Terminal } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Terminal Component Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-[#0c0d10] text-[#e6e8ee] font-mono-bbg p-6 select-none">
          <div className="max-w-xl w-full bg-[#14161d] border-2 border-[#ff9900] rounded p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center space-x-3 border-b border-[#2d3240] pb-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-[#ff9900]" />
              <div>
                <h1 className="text-sm font-bold text-[#ff9900] uppercase tracking-wider">
                  APEX TERMINAL // RUNTIME RECOVERY
                </h1>
                <p className="text-[11px] text-[#8e95a5]">
                  A client-side exception was intercepted by the terminal supervisor.
                </p>
              </div>
            </div>

            {/* Error Message */}
            <div className="bg-[#0a0b0e] border border-[#232733] p-3 rounded text-xs mb-4 overflow-x-auto text-red-400">
              <span className="font-bold text-[#ff9900]">ERR_DETAIL: </span>
              {this.state.error?.message || 'Unknown runtime error'}
            </div>

            {this.state.errorInfo?.componentStack && (
              <pre className="bg-[#08090b] border border-[#1b1e26] p-2.5 rounded text-[10px] text-[#717b8f] mb-4 max-h-40 overflow-y-auto custom-scrollbar">
                {this.state.errorInfo.componentStack}
              </pre>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={this.handleReset}
                className="flex items-center space-x-2 px-4 py-2 bg-[#ff9900] hover:bg-[#ffaa22] text-black font-bold text-xs rounded cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>RELOAD TERMINAL</span>
              </button>
              <span className="text-[10px] text-[#555d6e]">
                PRESS F5 OR CLICK TO RESTORE FEED
              </span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
