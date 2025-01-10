import { cn } from "@/lib/utils";
import Image from "next/image";

const variantStyles: Record<BookCoverVariant, string> = {
  extraSmall: "book-cover_extra_small",
  small: "book-cover_small",
  medium: "book-cover_medium",
  regular: "book-cover_regular",
  wide: "book-cover_wide",
};

const BookCover = ({
  className,
  variant = "regular",
  coverColor = "#012b48",
  coverUrl = "https://placehold.com/400x600.png",
}: IBookCover) => {
  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        variantStyles[variant],
        className,
      )}
    >
      BOOK SIDE SVG
      <div
        className="absolute z-10"
        style={{ left: "12%", width: "87.5%", height: "88%" }}
      >
        <Image
          src={coverUrl}
          alt="Book Cover"
          fill
          className="rounded-sm object-fill"
        />
      </div>
    </div>
  );
};

export default BookCover;
