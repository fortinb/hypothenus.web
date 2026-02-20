export function hasRole(
  userRoles: string[] | undefined,
  required: string | string[]
) {
  if (!userRoles) return false;

  if (Array.isArray(required)) {
    return required.some(role => userRoles.includes(role));
  }

  return userRoles.includes(required);
}
