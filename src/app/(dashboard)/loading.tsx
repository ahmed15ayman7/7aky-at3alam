export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 animate-ping">
            <div className="h-16 w-16 rounded-full bg-primary opacity-20 mx-auto"></div>
          </div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
        </div>
        <div>
          <h3 className="text-lg font-semibold">جاري التحميل...</h3>
          <p className="text-sm text-muted-foreground">يرجى الانتظار</p>
        </div>
      </div>
    </div>
  );
}

