export class NotificationEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly message: string,
    public readonly referenceId: string,
    public readonly referenceType: string,
    public readonly createdAt: Date,
    public readonly read: boolean = false
  ) {}
}
