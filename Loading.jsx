export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
            <div className="flex flex-col items-center gap-4">

                {/* Blue Spinner */}
                <div className="w-16 h-16 border-4 border-blue-200 border-t-[#00B4D8] rounded-full animate-spin"></div>

                {/* Loading Text */}
                <p className="text-[#00B4D8] font-semibold text-lg tracking-wide">
                    Loading...
                </p>

            </div>
        </div>
    );
}
