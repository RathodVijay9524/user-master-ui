import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <div className="text-center max-w-2xl mx-auto p-8">
            <div className="text-8xl mb-4">💥</div>
            <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
            <p className="text-xl opacity-70 mb-8">
              We're sorry, but something unexpected happened.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Reload Page
            </button>
            {this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm opacity-70">
                  Error Details
                </summary>
                <pre className="mt-2 p-4 bg-gray-800 rounded text-xs overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
