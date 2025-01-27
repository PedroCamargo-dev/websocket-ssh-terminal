function PageNotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex max-h-full w-full max-w-md flex-col gap-4 rounded-xl bg-white bg-opacity-10 bg-clip-padding p-8 text-white backdrop-blur-xl backdrop-filter">
        <h1 className="text-2xl font-medium">Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <button
          className="w-full rounded-xl border-none bg-slate-500 bg-opacity-10 p-2 text-white outline-none transition-all duration-200 hover:bg-opacity-20"
          onClick={() => window.location.replace('/')}
        >
          Go Home
        </button>
      </div>
    </div>
  )
}

export { PageNotFound }
