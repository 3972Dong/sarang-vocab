"use client";

import { School } from "@prisma/client";

interface SchoolCardProps {
    school: School;
}

export default function SchoolCard({ school }: SchoolCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
            <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 relative">
                {/* Placeholder for Image */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs uppercase font-bold">
                    {school.name.substring(0, 2)}
                </div>
                {school.nicheGrade && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-800 shadow-sm">
                        Niche {school.nicheGrade}
                    </div>
                )}
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {school.type} • {school.gender}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                        {school.city}, {school.state}
                    </span>
                </div>

                <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight group-hover:text-indigo-600 transition">
                    {school.name}
                </h3>

                <p className="text-xs text-gray-500 mb-4 line-clamp-2 min-h-[2.5em]">
                    {school.description || "No description available."}
                </p>

                <div className="space-y-1 text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between">
                        <span className="text-xs text-gray-400">Tuition</span>
                        <span className="font-semibold text-gray-900">{school.tuition || "N/A"}</span>
                    </div>
                    {school.programFee && (
                        <div className="flex justify-between">
                            <span className="text-xs text-gray-400">Prog. Fee</span>
                            <span className="font-semibold text-indigo-700">{school.programFee}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-xs text-gray-400">TOEFL</span>
                        <span className="font-medium text-gray-700">{school.toeflReq || "N/A"}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-auto">
                    <div className="flex gap-2">
                        {school.apCount && school.apCount > 0 ? (
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                AP {school.apCount}
                            </span>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
