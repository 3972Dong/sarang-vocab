"use client";

import { School } from "@prisma/client";
import { useState, useMemo } from "react";
import SchoolCard from "./SchoolCard";

interface SchoolListProps {
    initialSchools: School[];
}

export default function SchoolList({ initialSchools }: SchoolListProps) {
    const [schools] = useState<School[]>(initialSchools);

    // Filters
    const [filterState, setFilterState] = useState<string>("ALL");
    const [filterType, setFilterType] = useState<string>("ALL");
    const [filterGender, setFilterGender] = useState<string>("ALL");

    // Sort
    const [sortBy, setSortBy] = useState<string>("NAME_ASC"); // NAME_ASC, TUITION_ASC, NICHE_DESC

    // Extract Unique States
    const states = useMemo(() => {
        const unique = Array.from(new Set(schools.map(s => s.state)));
        return unique.sort();
    }, [schools]);

    // Filtering Logic
    const filteredSchools = useMemo(() => {
        return schools.filter(school => {
            if (filterState !== "ALL" && school.state !== filterState) return false;
            if (filterType !== "ALL" && school.type !== filterType) return false;
            if (filterGender !== "ALL" && school.gender !== filterGender) return false;
            return true;
        });
    }, [schools, filterState, filterType, filterGender]);

    // Sorting Logic
    const sortedSchools = useMemo(() => {
        const sorted = [...filteredSchools];

        sorted.sort((a, b) => {
            if (sortBy === "NAME_ASC") {
                return a.name.localeCompare(b.name);
            }
            if (sortBy === "NICHE_DESC") {
                // Approximate Niche Grades: A+ > A > A- > B+ > B
                const gradeMap: Record<string, number> = { "A+": 10, "A": 9, "A-": 8, "B+": 7, "B": 6, "B-": 5 };
                const gradeA = gradeMap[a.nicheGrade || ""] || 0;
                const gradeB = gradeMap[b.nicheGrade || ""] || 0;
                return gradeB - gradeA;
            }
            // Tuition sort is tricky as it is string. Just simple alpha sort for now or length.
            // MVP: Skip complex currency parsing for now.
            return 0;
        });

        return sorted;
    }, [filteredSchools, sortBy]);


    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8 text-center md:text-left">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                    BGE Recommended Schools
                </h1>
                <p className="text-gray-600 max-w-2xl">
                    Explore our curated list of top Boarding and Day schools tailored for international students.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-64 shrink-0 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            Filters
                        </h3>

                        {/* State Filter */}
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Location</label>
                            <select
                                value={filterState}
                                onChange={(e) => setFilterState(e.target.value)}
                                className="w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="ALL">All States</option>
                                {states.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>

                        {/* Type Filter */}
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">School Type</label>
                            <div className="space-y-2">
                                {['ALL', 'BOARDING', 'DAY'].map(type => (
                                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="type"
                                            value={type}
                                            checked={filterType === type}
                                            onChange={(e) => setFilterType(e.target.value)}
                                            className="text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700 capitalize">
                                            {type === 'ALL' ? 'All Types' : type.toLowerCase()}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Gender Filter */}
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Gender</label>
                            <div className="space-y-2">
                                {['ALL', 'COED', 'BOYS', 'GIRLS'].map(gender => (
                                    <label key={gender} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={gender}
                                            checked={filterGender === gender}
                                            onChange={(e) => setFilterGender(e.target.value)}
                                            className="text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700 capitalize">
                                            {gender === 'ALL' ? 'All Genders' : gender.toLowerCase()}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Sort Bar */}
                    <div className="flex justify-between items-center mb-6 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-sm font-medium text-gray-500">
                            Showing <strong className="text-gray-900">{sortedSchools.length}</strong> schools
                        </span>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-bold uppercase hidden sm:inline">Sort by</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="text-sm bg-gray-50 border-none rounded-lg focus:ring-0 text-gray-700 font-medium py-1 px-3"
                            >
                                <option value="NAME_ASC">Name (A-Z)</option>
                                <option value="NICHE_DESC">Niche Rank (High-Low)</option>
                            </select>
                        </div>
                    </div>

                    {/* Grid */}
                    {sortedSchools.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {sortedSchools.map(school => (
                                <SchoolCard key={school.id} school={school} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500 font-medium">No schools found matching your filters.</p>
                            <button
                                onClick={() => { setFilterState('ALL'); setFilterType('ALL'); setFilterGender('ALL'); }}
                                className="mt-4 text-indigo-600 font-bold text-sm hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
