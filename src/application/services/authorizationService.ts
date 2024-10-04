export class AuthorizationService {
  public static isAdmin(user: any): boolean {
    return user.role === "admin";
  }

  public static isManager(user: any): boolean {
    return user.role === "manager";
  }

  public static isAdminOrManager(user: any): boolean {
    return user.role === "admin" || user.role === "manager";
  }

  public static isResourceOwner(user: any, resourceOwnerId: string): boolean {
    return user.id === resourceOwnerId;
  }
}
