function PageNotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-opacity-10 flex max-h-full w-full max-w-md flex-col gap-4 rounded-xl bg-white bg-clip-padding p-8 text-white backdrop-blur-xl backdrop-sepia-0">
        <h1 className="text-2xl font-medium">Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <button
          className="bg-opacity-10 hover:bg-opacity-20 w-full rounded-xl border-none bg-slate-500 p-2 text-white transition-all duration-200 outline-none"
          onClick={() => window.location.replace('/')}
        >
          Go Home
        </button>
      </div>
    </div>
  )
}

export { PageNotFound }
