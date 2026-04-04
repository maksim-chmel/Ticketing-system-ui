import React from "react";
import AppNotice from "./AppNotice";
import "./PageState.css";

interface PageStateProps {
    title: string;
    message: string;
    variant?: "error" | "info";
    actionLabel?: string;
    onAction?: () => void;
}

const PageState: React.FC<PageStateProps> = ({
    title,
    message,
    variant = "info",
    actionLabel,
    onAction,
}) => {
    return (
        <div className="page-state">
            <AppNotice
                title={title}
                message={message}
                variant={variant}
                actionLabel={actionLabel}
                onAction={onAction}
                className="page-state-notice"
            />
        </div>
    );
};

export default PageState;
