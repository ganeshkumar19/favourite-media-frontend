export interface Favorite {
  id: number;
  title: string;
  type: "Movie" | "TV Show";
  director: string;
  budget: string;
  location: string;
  duration: string;
  yearOrTime: string;
}