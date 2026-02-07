export const DashboardStats = ({ stats, onClickWords }: { stats: any, onClickWords?: () => void }) => {
    if (!stats) return null;

    const progress = stats.totalDays > 0 ? (stats.completedCount / stats.totalDays) * 100 : 0;
    const averageScore = stats.avgScore || 0;
    const totalWords = stats.totalWords || 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gradient-to-br from-sarang-pink/30 to-sarang-lightPink/30 p-6 rounded-3xl shadow-sm border border-sarang-pink/20 transition hover:shadow-md">
                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Daily Test Score</h3>
                <p className="text-4xl font-bold text-gray-800">{averageScore}<span className="text-lg text-gray-400 font-normal">/5</span></p>
            </div>

            <div
                onClick={onClickWords}
                className="bg-gradient-to-br from-sarang-teal/30 to-teal-50 p-6 rounded-3xl shadow-sm border border-sarang-teal/20 cursor-pointer hover:shadow-lg transition group active:scale-95"
            >
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 group-hover:text-teal-700 transition">Total Words</h3>
                        <p className="text-4xl font-bold text-gray-800">{totalWords}</p>
                    </div>
                    <span className="text-3xl opacity-50 group-hover:scale-110 group-hover:rotate-12 transition duration-300">📚</span>
                </div>
            </div>

            <div className="bg-gradient-to-br from-sarang-lavender/40 to-lime-50 p-6 rounded-3xl shadow-sm border border-sarang-lavender/20 transition hover:shadow-md">
                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Monthly Progress</h3>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-gray-800">{Math.round(progress)}%</p>
                    <span className="text-sm text-gray-500 font-medium">
                        ({stats.completedCount}/{stats.totalDays} days)
                    </span>
                </div>
            </div>
        </div>
    );
};
