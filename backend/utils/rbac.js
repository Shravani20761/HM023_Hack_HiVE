export const ROLES = {
    CREATOR: 'creator',
    EDITOR: 'editor',
    MARKETER: 'marketer',
    MANAGER: 'manager',
    ADMIN: 'admin'
};

export const PERMISSIONS = {
    CREATE_CONTENT: [ROLES.CREATOR, ROLES.ADMIN],
    EDIT_CONTENT: [ROLES.EDITOR, ROLES.ADMIN],
    APPROVE_CONTENT: [ROLES.MARKETER, ROLES.ADMIN],
    PUBLISH_CONTENT: [ROLES.MARKETER, ROLES.ADMIN],
    VIEW_ANALYTICS: [ROLES.MANAGER, ROLES.ADMIN],
    VIEW_FEEDBACK: [ROLES.MANAGER, ROLES.MARKETER, ROLES.ADMIN],
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
