import { Injectable } from '@angular/core';
import { delay, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AsyncStorageService {
  constructor() {}

  query(entityType: string, delayTime = 500): Observable<any[]> {
    const entities = JSON.parse(localStorage.getItem(entityType) || '[]');
    return of(entities).pipe(delay(delayTime));
  }

  get(entityType: string, entityId: string) {
    return this.query(entityType).pipe(
      map((entities) => {
        const entity = entities.find((entity) => entity.id === entityId);
        if (!entity)
          throw new Error(
            `Get failed, cannot find entity with id: ${entityId} in: ${entityType}`
          );
        return entity;
      })
    );
  }

  post(entityType: string, newEntity: any) {
    newEntity = { ...newEntity };
    newEntity._id = this._makeId();
    return this.query(entityType).pipe(
      map((entities) => {
        entities.push(newEntity);
        this._save(entityType, entities);
        return newEntity;
      })
    );
  }

  put(entityType: string, updatedEntity: any) {
    return this.query(entityType).pipe(
      map((entities) => {
        const idx = entities.findIndex(
          (entity) => entity.id === updatedEntity.id
        );
        if (idx < 0)
          return throwError(
            () =>
              new Error(
                `Update failed, cannot find entity with id: ${updatedEntity.id} in: ${entityType}`
              )
          );
        entities.splice(idx, 1, updatedEntity);
        this._save(entityType, entities);
        return updatedEntity;
      })
    );
  }

  remove(entityType: string, entityId: string) {
    return this.query(entityType).pipe(
      map((entities) => {
        const idx = entities.findIndex((entity) => entity.id === entityId);
        if (idx < 0)
          return throwError(
            () =>
              new Error(
                `Remove failed, cannot find entity with id: ${entityId} in: ${entityType}`
              )
          );
        const removedEntity = entities.splice(idx, 1);
        this._save(entityType, entities);
        return removedEntity[0]; // מחזירים את הישויות שהוסרו
      })
    );
  }

  private _save(entityType: string, entities: any) {
    localStorage.setItem(entityType, JSON.stringify(entities));
  }

  private _makeId(length: number = 10) {
    var text = '';
    var possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
