import { SYSTEM_PERMISSIONS, checkSystemPermission } from '../utils/rbac.js';

export const getSystemCapabilities = (req, res) => {
    const userSystemRoles = req.user.systemRoles || [];

    const capabilities = {};
    for (const [action, allowedRoles] of Object.entries(SYSTEM_PERMISSIONS)) {
        // Convert ACTION_NAME to canActionName
        const camelCaseAction = 'can' + action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');

        capabilities[camelCaseAction] = checkSystemPermission(userSystemRoles, action);
    }

    res.json(capabilities);
};
