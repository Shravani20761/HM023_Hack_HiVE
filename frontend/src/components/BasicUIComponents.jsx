import React from 'react';

// --- Icons ---
export const Icons = {
    Plus: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Trash: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
    Edit: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
    Users: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    Calendar: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
    BarChart: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
    Layers: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>,
    MessageSquare: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
    Settings: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    Check: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    Send: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
    Heart: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
    Share: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>,
    Zap: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
    Sparkles: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"></path></svg>,
    Rocket: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"></path><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>,
    Eye: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
    TrendingUp: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>,
};

// --- Vibrant Components ---

export const Card = ({ children, className = "", gradient = false, hover = true }) => (
    <div className={`
        ${gradient ? 'bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30' : 'bg-white'}
        rounded-2xl shadow-lg border border-purple-100/50 overflow-hidden
        ${hover ? 'hover:shadow-xl hover:-translate-y-1 hover:border-purple-200/50' : ''}
        transition-all duration-300 ease-out
        ${className}
    `}>
        {children}
    </div>
);

export const GradientCard = ({ children, className = "", variant = "purple" }) => {
    const gradients = {
        purple: "from-purple-500 via-pink-500 to-rose-500",
        blue: "from-blue-500 via-cyan-500 to-teal-500",
        orange: "from-orange-500 via-amber-500 to-yellow-500",
        green: "from-green-500 via-emerald-500 to-teal-500",
        pink: "from-pink-500 via-rose-500 to-red-500",
    };

    return (
        <div className={`
            bg-gradient-to-br ${gradients[variant]}
            rounded-2xl shadow-lg overflow-hidden
            hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02]
            transition-all duration-300 ease-out
            ${className}
        `}>
            {children}
        </div>
    );
};

export const PageHeader = ({ title, subtitle, action }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="relative">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent tracking-tight">
                {title}
            </h2>
            {subtitle && (
                <p className="text-slate-500 mt-2 flex items-center gap-2">
                    <span className="inline-block w-8 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></span>
                    {subtitle}
                </p>
            )}
        </div>
        {action && <div className="animate-fade-in">{action}</div>}
    </div>
);

export const Button = ({ children, variant = "primary", className = "", size = "md", ...props }) => {
    const baseStyle = "inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl";

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
    };

    const variants = {
        primary: "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 hover:scale-105",
        secondary: "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 shadow-md hover:shadow-lg hover:-translate-y-0.5",
        success: "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5",
        danger: "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-0.5",
        warning: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5",
        ghost: "text-slate-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600",
        outline: "border-2 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400",
    };

    return (
        <button className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export const Badge = ({ children, color = "gray", pulse = false, className = "" }) => {
    const colors = {
        gray: "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-slate-300",
        blue: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-300",
        green: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300",
        red: "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-300",
        purple: "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-300",
        amber: "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-300",
        pink: "bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 border-pink-300",
    };

    return (
        <span className={`
            inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border
            ${colors[color]} ${pulse ? 'animate-pulse' : ''}
            transition-all duration-200 hover:scale-105
            ${className}
        `}>
            {children}
        </span>
    );
};

export const StatusBadge = ({ status }) => {
    const configs = {
        draft: { color: "from-slate-400 to-slate-500", label: "Draft", icon: "📝" },
        review: { color: "from-amber-400 to-orange-500", label: "Review", icon: "👀" },
        approved: { color: "from-green-400 to-emerald-500", label: "Approved", icon: "✅" },
        published: { color: "from-blue-400 to-cyan-500", label: "Published", icon: "🚀" },
        pending: { color: "from-amber-400 to-orange-500", label: "Pending", icon: "⏳" },
        failed: { color: "from-red-400 to-rose-500", label: "Failed", icon: "❌" },
    };

    const config = configs[status] || configs.draft;

    return (
        <span className={`
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white
            bg-gradient-to-r ${config.color}
            shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105
        `}>
            <span>{config.icon}</span>
            {config.label}
        </span>
    );
};

export const Loader = () => (
    <div className="flex flex-col justify-center items-center p-12 gap-4">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-pink-400 opacity-20"></div>
        </div>
        <p className="text-sm font-medium text-slate-500 animate-pulse">Loading magic...</p>
    </div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-purple-200 rounded-3xl bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-rose-50/50">
        <div className="relative mb-6">
            <div className="h-20 w-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-slow">
                {Icon && <Icon className="text-purple-500 w-10 h-10" />}
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center text-xs animate-pulse">
                ✨
            </div>
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">{title}</h3>
        <p className="text-slate-500 max-w-sm mb-6">{description}</p>
        {action}
    </div>
);

export const Tabs = ({ tabs, activeTab, onChange }) => (
    <div className="flex bg-gradient-to-r from-purple-50 to-pink-50 p-1 rounded-xl mb-6 overflow-x-auto">
        {tabs.map((tab) => (
            <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`
                    px-6 py-3 text-sm font-bold rounded-lg transition-all duration-200 whitespace-nowrap
                    ${activeTab === tab.id
                        ? "bg-white text-purple-600 shadow-md"
                        : "text-slate-500 hover:text-purple-600 hover:bg-white/50"
                    }
                `}
            >
                {tab.label}
            </button>
        ))}
    </div>
);

export const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-2xl",
        xl: "max-w-4xl"
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className={`
                bg-white rounded-3xl shadow-2xl ${sizeClasses[size]} w-full mx-4
                animate-slide-up border border-purple-100
            `}>
                <div className="flex items-center justify-between p-6 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-3xl">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{title}</h3>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200 hover:rotate-90"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

export const Input = ({ label, className = "", icon: Icon, ...props }) => (
    <div className="relative group">
        {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors">
                <Icon className="w-5 h-5" />
            </div>
        )}
        <input
            {...props}
            className={`
                w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3
                border-2 border-slate-200 rounded-xl text-sm
                bg-gradient-to-r from-white to-slate-50
                focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100
                hover:border-purple-200
                transition-all duration-200
                placeholder:text-slate-400
                ${className}
            `}
        />
    </div>
);

export const TextArea = ({ label, className = "", rows = 3, ...props }) => (
    <textarea
        {...props}
        rows={rows}
        className={`
            w-full px-4 py-3
            border-2 border-slate-200 rounded-xl text-sm
            bg-gradient-to-r from-white to-slate-50
            focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100
            hover:border-purple-200
            transition-all duration-200 resize-none
            placeholder:text-slate-400
            ${className}
        `}
    />
);

export const Select = ({ options, className = "", ...props }) => (
    <select
        {...props}
        className={`
            w-full px-4 py-3
            border-2 border-slate-200 rounded-xl text-sm
            bg-gradient-to-r from-white to-slate-50
            focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100
            hover:border-purple-200
            transition-all duration-200
            cursor-pointer
            ${className}
        `}
    >
        {options?.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
        ))}
    </select>
);

export const MetricCard = ({ icon: Icon, label, value, trend, color = "purple" }) => {
    const gradients = {
        purple: "from-purple-500 to-pink-500",
        blue: "from-blue-500 to-cyan-500",
        green: "from-green-500 to-emerald-500",
        amber: "from-amber-500 to-orange-500",
        pink: "from-pink-500 to-rose-500",
    };

    return (
        <Card className="p-6 relative overflow-hidden group">
            <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${gradients[color]} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="relative">
                <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[color]} flex items-center justify-center shadow-lg`}>
                        {Icon && <Icon className="w-6 h-6 text-white" />}
                    </div>
                    {trend && (
                        <span className={`text-sm font-bold ${trend > 0 ? 'text-green-500' : 'text-red-500'} flex items-center gap-1`}>
                            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                        </span>
                    )}
                </div>
                <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
                <p className={`text-3xl font-extrabold bg-gradient-to-r ${gradients[color]} bg-clip-text text-transparent`}>
                    {value}
                </p>
            </div>
        </Card>
    );
};

export const Avatar = ({ name, size = "md", className = "" }) => {
    const sizes = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-14 h-14 text-lg",
    };

    const colors = [
        "from-purple-400 to-pink-400",
        "from-blue-400 to-cyan-400",
        "from-green-400 to-emerald-400",
        "from-amber-400 to-orange-400",
        "from-rose-400 to-red-400",
    ];

    const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
    const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

    return (
        <div className={`
            ${sizes[size]}
            bg-gradient-to-br ${colors[colorIndex]}
            rounded-full flex items-center justify-center
            font-bold text-white shadow-md
            hover:scale-110 transition-transform duration-200
            ${className}
        `}>
            {initials}
        </div>
    );
};

export const ProgressBar = ({ value, max = 100, color = "purple" }) => {
    const gradients = {
        purple: "from-purple-500 to-pink-500",
        blue: "from-blue-500 to-cyan-500",
        green: "from-green-500 to-emerald-500",
    };

    const percentage = Math.min(100, (value / max) * 100);

    return (
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
                className={`h-full bg-gradient-to-r ${gradients[color]} rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
};

export const Tooltip = ({ children, content }) => (
    <div className="relative group">
        {children}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>
    </div>
);
