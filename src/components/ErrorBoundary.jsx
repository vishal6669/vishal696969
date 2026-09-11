import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled Application Error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface-50 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-surface-200 shadow-card-lg space-y-4">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-ink">Something went wrong</h2>
              <p className="text-xs text-surface-500 mt-1 leading-relaxed">
                The application encountered an unexpected runtime error. We have logged the diagnostic details.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-surface-50 rounded-xl border border-surface-200 text-left">
                <p className="text-[11px] font-mono text-rose-700 break-words font-semibold">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
