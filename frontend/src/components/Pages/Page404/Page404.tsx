function Page404() {
  return (
    <section className="rounded-[28px] border border-[#eadfd7] bg-white p-6 shadow-sm">
      <p className="mb-2 text-sm uppercase tracking-[0.24em] text-[#b08f82]">
        404
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-[#3c312c]">
        Page not found
      </h2>
      <p className="mt-2 text-[#6f625b]">
        The page you tried to open does not exist.
      </p>
    </section>
  );
}

export default Page404;