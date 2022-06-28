import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Functions, getFunctions, httpsCallable } from 'firebase/functions';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private functions: Functions

  constructor() {
    const app = initializeApp({
      apiKey: "AIzaSyDFVxILlpxP6AA0Q3xSQi0omJthcix6VG8",
      authDomain: "rafflesia-overleaf.firebaseapp.com",
      projectId: "rafflesia-overleaf",
      storageBucket: "rafflesia-overleaf.appspot.com",
      messagingSenderId: "1063644554388",
      appId: "1:1063644554388:web:d388acefb9a12b63250081"
    })
    this.functions = getFunctions(app)
  }

  getFunction(name: string) {
    return httpsCallable(this.functions, name)
  }
}
