import { Injectable } from '@angular/core';
import { delay, map, Observable, of, throwError } from 'rxjs';

interface Identifiable {
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class AsyncStorageService {
  constructor() {}

  query<T extends Identifiable>(
    entityType: string,
    delayTime = 500
  ): Observable<T[]> {
    const entities = JSON.parse(localStorage.getItem(entityType) || '[]');
    return of(entities).pipe(delay(delayTime));
  }

  get<T extends Identifiable>(
    entityType: string,
    entityId: string
  ): Observable<T> {
    return this.query<T>(entityType).pipe(
      map((entities) => {
        const entity = entities.find((entity) => entity.id === entityId);
        if (!entity)
          throw new Error(
            `404 Not Found: Entity with ID '${entityId}' was not found in '${entityType}'.`
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
          throw new Error(
            `Update failed, cannot find entity with id: ${updatedEntity.id} in: ${entityType}`
          );
        entities[idx] = { ...updatedEntity };
        this._save(entityType, entities);
        return updatedEntity;
      })
    );
  }

  remove<T extends Identifiable>(entityType: string, entityId: string) {
    return this.query<T>(entityType).pipe(
      map((entities) => {
        const idx = entities.findIndex((entity) => {
          return entity.id === entityId;
        });
        if (idx < 0)
          throw new Error(
            `Remove failed, cannot find entity with id: ${entityId} in: ${entityType}`
          );
        const removedEntity = entities.splice(idx, 1);
        this._save(entityType, entities);
        return removedEntity[0];
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
