import React from 'react'

const Loader = () => {
            return (
                <div className="flex items-center justify-center py-6">
                    <div className="animate-spin h-6 w-6 border-4 border-[#032B4E] border-t-transparent rounded-full" />
                    <span className="ml-3 text-sm text-gray-600">Processing…</span>
                </div>
            );
}

export default Loader