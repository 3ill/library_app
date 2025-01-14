import { signOut } from "@/auth";
import BookList from "@/components/book-list";
import { sampleBooks } from "@/constants";

const MyProfile = () => {
  return (
    <>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
        className="mb-10"
      >
        <button className="form-btn !w-[100px]">Logout</button>
      </form>
      <BookList title="Borrowed Books" books={sampleBooks} />
    </>
  );
};

export default MyProfile;
