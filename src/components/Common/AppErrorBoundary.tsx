import React from "react";
import AppNotice from "./AppNotice";

interface AppErrorBoundaryState {
    hasError: boolean;
}

class AppErrorBoundary extends React.Component<React.PropsWithChildren, AppErrorBoundaryState> {
    state: AppErrorBoundaryState = {
        hasError: false,
    };

    static getDerivedStateFromError(): AppErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error) {
        console.error("Unhandled UI error:", error);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="App">
                    <div style={{ width: "min(100%, 560px)", margin: "120px auto 0", position: "relative", zIndex: 1 }}>
                        <AppNotice
                            title="Application error"
                            message="Something went wrong while rendering this page. Reload the application and try again."
                            variant="error"
                            actionLabel="Reload application"
                            onAction={this.handleReload}
                        />
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default AppErrorBoundary;
