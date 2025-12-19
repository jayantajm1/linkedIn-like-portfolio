import { Injectable } from "@angular/core";
import { Observable, from, map, catchError, of } from "rxjs";
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "@angular/fire/firestore";
import { VisitorInfo } from "../models/visitor.model";

@Injectable({
  providedIn: "root",
})
export class FirebaseService {
  private readonly COLLECTION_NAME = "visitors";

  constructor(private firestore: Firestore) {}

  saveVisitor(visitor: VisitorInfo): Observable<void> {
    const visitorsRef = collection(this.firestore, this.COLLECTION_NAME);
    return from(
      addDoc(visitorsRef, {
        ...visitor,
        timestamp: Timestamp.fromMillis(visitor.timestamp),
      })
    ).pipe(
      map(() => undefined),
      catchError((error) => {
        console.error("Error saving visitor:", error);
        return of(undefined);
      })
    );
  }

  getAllVisitors(): Observable<VisitorInfo[]> {
    const visitorsRef = collection(this.firestore, this.COLLECTION_NAME);
    const q = query(visitorsRef, orderBy("timestamp", "desc"));

    return from(getDocs(q)).pipe(
      map((snapshot) => {
        return snapshot.docs.map((doc) => {
          const data = doc.data() as any;
          return {
            ...data,
            timestamp: data.timestamp?.toMillis() || data.timestamp,
            id: doc.id,
          } as VisitorInfo;
        });
      }),
      catchError((error) => {
        console.error("Error fetching visitors:", error);
        return of([]);
      })
    );
  }

  getVisitorsByDateRange(
    startDate: Date,
    endDate: Date
  ): Observable<VisitorInfo[]> {
    const visitorsRef = collection(this.firestore, this.COLLECTION_NAME);
    const q = query(
      visitorsRef,
      where("timestamp", ">=", Timestamp.fromDate(startDate)),
      where("timestamp", "<=", Timestamp.fromDate(endDate)),
      orderBy("timestamp", "desc")
    );

    return from(getDocs(q)).pipe(
      map((snapshot) => {
        return snapshot.docs.map((doc) => {
          const data = doc.data() as any;
          return {
            ...data,
            timestamp: data.timestamp?.toMillis() || data.timestamp,
            id: doc.id,
          } as VisitorInfo;
        });
      }),
      catchError((error) => {
        console.error("Error fetching visitors by date range:", error);
        return of([]);
      })
    );
  }
}
