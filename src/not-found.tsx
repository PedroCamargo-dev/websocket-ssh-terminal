import { Button } from './core/components/atoms'

function PageNotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex max-h-full w-full max-w-md flex-col gap-4 rounded-xl bg-white/10 bg-clip-padding p-8 text-white backdrop-blur-xl backdrop-sepia-0">
        <h1 className="text-2xl font-medium">Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.location.replace('/')}
        >
          Go Home
        </Button>
      </div>
    </div>
  )
}

export { PageNotFound }
