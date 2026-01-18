export const ROLES = {
    CREATOR: 'creator',
    EDITOR: 'editor',
    MARKETER: 'marketer',
    MANAGER: 'manager',
    ADMIN: 'admin'
};

export const PERMISSIONS = {
    // Content permissions
    CREATE_CONTENT: [ROLES.CREATOR, ROLES.ADMIN],
    EDIT_CONTENT: [ROLES.EDITOR, ROLES.ADMIN],
    SUBMIT_REVIEW: [ROLES.CREATOR, ROLES.EDITOR, ROLES.ADMIN],
    APPROVE_CONTENT: [ROLES.MARKETER, ROLES.ADMIN],
    REJECT_CONTENT: [ROLES.MARKETER, ROLES.ADMIN],
    PUBLISH_CONTENT: [ROLES.MARKETER, ROLES.ADMIN],

    // Asset permissions
    UPLOAD_ASSET: [ROLES.CREATOR, ROLES.EDITOR, ROLES.MARKETER, ROLES.ADMIN],
    DELETE_ASSET: [ROLES.CREATOR, ROLES.EDITOR, ROLES.ADMIN],

    // AI permissions
    USE_AI_CREATOR: [ROLES.CREATOR, ROLES.EDITOR, ROLES.ADMIN],
    USE_AI_MANAGER: [ROLES.MARKETER, ROLES.MANAGER, ROLES.ADMIN],

    // Schedule permissions
    CREATE_SCHEDULE: [ROLES.MARKETER, ROLES.ADMIN],
    VIEW_SCHEDULE: [ROLES.MARKETER, ROLES.MANAGER, ROLES.ADMIN],

    // Feedback permissions
    REPLY_FEEDBACK: [ROLES.MARKETER, ROLES.MANAGER, ROLES.ADMIN],
    ASSIGN_FEEDBACK: [ROLES.MANAGER, ROLES.ADMIN],

    // Analytics permissions
    VIEW_ANALYTICS: [ROLES.MANAGER, ROLES.ADMIN],
    VIEW_FEEDBACK: [ROLES.MANAGER, ROLES.MARKETER, ROLES.ADMIN],

    // YouTube permissions
    CONNECT_YOUTUBE: [ROLES.ADMIN],
    DISCONNECT_YOUTUBE: [ROLES.ADMIN],
    VIEW_YOUTUBE: [ROLES.CREATOR, ROLES.EDITOR, ROLES.MARKETER, ROLES.MANAGER, ROLES.ADMIN],
    MANAGE_YOUTUBE_VIDEOS: [ROLES.CREATOR, ROLES.EDITOR, ROLES.ADMIN],
    UPLOAD_YOUTUBE: [ROLES.CREATOR, ROLES.MARKETER, ROLES.ADMIN],
    SCHEDULE_YOUTUBE: [ROLES.MARKETER, ROLES.ADMIN],
    VIEW_YOUTUBE_ANALYTICS: [ROLES.MANAGER, ROLES.ADMIN],

    // Admin permissions
    ASSIGN_ROLES: [ROLES.ADMIN]
};

export const checkPermission = (userRoles, action) => {
    const allowedRoles = PERMISSIONS[action];
    if (!allowedRoles) return false;

    return userRoles.some(role => allowedRoles.includes(role));
};

export const SYSTEM_ROLES = {
    SUPER_ADMIN: 'super_admin',
    ORG_ADMIN: 'org_admin',
    MEMBER: 'member'
};

export const SYSTEM_PERMISSIONS = {
    CREATE_CAMPAIGN: [SYSTEM_ROLES.ORG_ADMIN, SYSTEM_ROLES.SUPER_ADMIN],
    MANAGE_SYSTEM_ROLES: [SYSTEM_ROLES.SUPER_ADMIN],
    MANAGE_INTEGRATIONS: [SYSTEM_ROLES.SUPER_ADMIN]
};

export const checkSystemPermission = (userSystemRoles, action) => {
    const allowedRoles = SYSTEM_PERMISSIONS[action];
    if (!allowedRoles) return false;

    return userSystemRoles.some(role => allowedRoles.includes(role));
};
