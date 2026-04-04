import React from "react";
import "./AppNotice.css";

type AppNoticeVariant = "error" | "success" | "info";

interface AppNoticeProps {
    title?: string;
    message: string;
    variant?: AppNoticeVariant;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

const AppNotice: React.FC<AppNoticeProps> = ({
    title,
    message,
    variant = "info",
    actionLabel,
    onAction,
    className = "",
}) => {
    return (
        <div className={`app-notice app-notice-${variant} ${className}`.trim()} role={variant === "error" ? "alert" : "status"}>
            {title && <div className="app-notice-title">{title}</div>}
            <div className="app-notice-message">{message}</div>
            {actionLabel && onAction && (
                <button type="button" className="app-notice-action" onClick={onAction}>
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default AppNotice;
