interface IBookOverview {
  id: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverColor: string;
  coverUrl: string;
  videoUrl: string;
  summary: string;
  isLoanedBook: boolean;
}

interface IBookCover {
  className?: string;
  variant?: BookCoverVariant;
  coverColor?: string;
  coverUrl?: string;
}

type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";
