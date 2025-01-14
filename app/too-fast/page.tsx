const TooFastPage = () => {
  return (
    <main className="root-container flex min-h-screen flex-col items-center justify-center">
      <h1 className="font-bebas-neue text-5xl font-bold capitalize text-light-100">
        Whoa, Step up on the breaks
      </h1>
      <p className="mt-3 max-w-xl text-center text-light-400">
        Sorry, you are going too fast. we&apos;ve put a temporary pause on your
        request. try again later.
      </p>
    </main>
  );
};

export default TooFastPage;
