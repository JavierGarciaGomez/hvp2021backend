export class NewBaseEntity {
  static fromDocument<TDocument, TEntity>(
    this: new (data: Partial<TEntity>) => TEntity,
    document: TDocument
  ): TEntity {
    const obj = document.toObject();
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    return new this(obj as Partial<TEntity>);
  }
}
