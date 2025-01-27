export interface AutoNewsFormData {
  language: string;
  category: string;
  subcategory?: string;
  status: "published" | "unpublished";
  author: string | null;
  link: string;
  duration: number;
}

export interface IAutoNews {
  _id: string;
  language: string;
  category: {
    _id: string;
    title: string;
  };
  subcategory?: string;
  status: "published" | "unpublished";
  link: string;
  author: string;
  duration: string;
  createdAt: string;
  updatedAt: string;
}
