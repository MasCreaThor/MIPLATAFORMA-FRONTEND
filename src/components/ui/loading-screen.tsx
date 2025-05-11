// src/components/ui/loading-screen.tsx
export function LoadingScreen() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mb-4"></div>
          <h2 className="text-xl font-medium text-gray-700">Cargando...</h2>
        </div>
      </div>
    );
  }