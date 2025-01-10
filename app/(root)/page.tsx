import BookList from "@/components/book-list";
import BookOverview from "@/components/book-overview";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <>
      <BookOverview />
      <BookList />
    </>
  );
};

export default Home;
