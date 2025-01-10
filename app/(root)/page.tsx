import BookList from "@/components/book-list";
import BookOverview from "@/components/book-overview";
import { Button } from "@/components/ui/button";
import { sampleBooks } from "@/constants";

const Home = () => {
  return (
    <>
      <BookOverview {...sampleBooks[0]} />
      <BookList
        title="Latest Books"
        books={sampleBooks}
        containerClassName="mt-28"
      />
    </>
  );
};

export default Home;
