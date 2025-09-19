"use client"

const StatisticsPage = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 p-3 sm:p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 min-h-screen w-full">
        <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2 row-span-1 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-500 to-purple-600 text-white relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">Welcome back, John!</h1>
              <p className="text-purple-100 text-xs sm:text-sm">Have a great day at work</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-4 row-span-1 md:row-span-2 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white shadow-lg">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-1">Monthly POs (mockup data)</h2>
            <p className="text-xs sm:text-sm text-slate-500">January - Sept 2025</p>
          </div>

          <div className="flex items-end justify-between h-32 sm:h-48 md:h-64 px-2 sm:px-4">
            {[
              { month: "Jan", value: 18600, height: "h-12 sm:h-20 md:h-24" },
              { month: "Feb", value: 30500, height: "h-24 sm:h-36 md:h-48" },
              { month: "Mar", value: 23700, height: "h-18 sm:h-28 md:h-36" },
              { month: "Apr", value: 7300, height: "h-6 sm:h-10 md:h-12" },
              { month: "May", value: 20900, height: "h-16 sm:h-24 md:h-32" },
              { month: "Jun", value: 24400, height: "h-20 sm:h-32 md:h-40" },
              { month: "Jul", value: 6400, height: "h-5 sm:h-8 md:h-10" },
              { month: "Aug", value: 4400, height: "h-4 sm:h-6 md:h-8" },
              { month: "Sep", value: 14400, height: "h-10 sm:h-16 md:h-20" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-1 sm:gap-2">
                <span className="text-xs font-medium text-slate-600 hidden sm:block">{item.value}</span>
                <div
                  className={`w-6 sm:w-8 md:w-12 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg ${item.height}`}
                ></div>
                <span className="text-xs text-slate-500">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2 row-span-1 md:row-span-2 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white shadow-lg">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">Target vs Achieved Revenue</h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">Track your revenue progress</p>

          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto">
            <svg className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 transform -rotate-90" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r="52"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-slate-200"
              />
              <circle
                cx="64"
                cy="64"
                r="52"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - 0.93)}`}
                className="text-green-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">93.22L</span>
            </div>
          </div>
        </div>

        <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2 row-span-1 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <h3 className="text-base sm:text-lg font-semibold mb-2">Need Assistance?</h3>
          <p className="text-purple-100 text-xs sm:text-sm mb-3 sm:mb-4">
            Get actionable insights and recommendations.
          </p>
          <button className="bg-white text-purple-600 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-purple-50 transition-colors">
            Keep Chat with Me
          </button>
        </div>

        <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2 row-span-1 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white shadow-lg">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-wide">UNIT FILL RATE</p>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">31%</span>
                <span className="text-xs sm:text-sm text-slate-500 hidden sm:block">7 platforms avg</span>
                <span className="text-xs sm:text-sm text-green-600">↗ 12%</span>
              </div>
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
          <div className="h-6 sm:h-8 flex items-end gap-1">
            {[2, 3, 2, 4, 3, 5, 4, 6].map((height, i) => (
              <div
                key={i}
                className={`w-1.5 sm:w-2 bg-blue-400 rounded-sm`}
                style={{ height: `${height * 2}px` }}
              ></div>
            ))}
          </div>
        </div>

        <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2 row-span-1 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white shadow-lg">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-wide">LINE FILL RATE</p>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">30%</span>
                <span className="text-xs sm:text-sm text-slate-500 hidden sm:block">7 platforms avg</span>
                <span className="text-xs sm:text-sm text-green-600">↗ 8%</span>
              </div>
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <div className="h-6 sm:h-8 flex items-end gap-1">
            {[3, 4, 5, 6, 7, 8, 7].map((height, i) => (
              <div
                key={i}
                className={`w-2 sm:w-3 bg-orange-400 rounded-sm`}
                style={{ height: `${height * 1.5}px` }}
              ></div>
            ))}
          </div>
        </div>

        <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2 row-span-1 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white shadow-lg">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-wide">NZFR</p>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">34%</span>
                <span className="text-xs sm:text-sm text-slate-500 hidden sm:block">7 New Products</span>
                <span className="text-xs sm:text-sm text-green-600">↗ 5%</span>
              </div>
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="h-6 sm:h-8 flex items-end gap-1">
            {[4, 3, 5, 6, 7, 6, 8, 7].map((height, i) => (
              <div
                key={i}
                className={`w-1.5 sm:w-2 bg-green-400 rounded-sm`}
                style={{ height: `${height * 1.5}px` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatisticsPage
