import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})

export class StorageService {

    setStorage(key: string, value: string): Promise<void> {
    return Preferences.set({ key: key, value: value });
    }

    getStorage(key: string): Promise<{ value: string | null }> {
      return Preferences.get({ key: key });
    }

    removeStorage(key: string): Promise<void> {
      return Preferences.remove({ key: key });
    }

    clearStorage(): Promise<void> {
      return Preferences.clear();
    }
}
