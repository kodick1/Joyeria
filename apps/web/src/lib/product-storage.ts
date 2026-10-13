"use client";

import type { Product } from "@/lib/products";

const databaseName = "aurelia-visual-store";
const storeName = "products";
const databaseVersion = 1;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(storeName)) {
        database.createObjectStore(storeName, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("No se pudo abrir el almacenamiento local."));
  });
}

export async function getSavedProducts(): Promise<Product[]> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readonly");
    const request = transaction.objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result as Product[]);
    request.onerror = () => reject(request.error ?? new Error("No se pudieron leer las piezas guardadas."));
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => database.close();
  });
}

export async function saveProduct(product: Product): Promise<void> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).put(product);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error ?? new Error("No se pudo guardar la pieza en este navegador."));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error ?? new Error("Se canceló el guardado de la pieza."));
    };
  });
}
