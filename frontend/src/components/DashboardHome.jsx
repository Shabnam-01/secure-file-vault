import { useOutletContext } from "react-router-dom";
import { HardDrive, Shield, Clock } from "lucide-react";

const DashboardHome = () => {
  const { stats } = useOutletContext();

  if (!stats) {
    return <div className="text-slate-400">Loading stats...</div>;
  }

  let totalSizeDisplay;
if (stats.totalStorageUsed >= 1024 * 1024 * 1024) {
  totalSizeDisplay = (stats.totalStorageUsed / (1024 * 1024 * 1024)).toFixed(2) + " GB";
} else {
  totalSizeDisplay = (stats.totalStorageUsed / (1024 * 1024)).toFixed(2) + " MB";
}
  const totalSizePercent = ((stats.totalStorageUsed / (10 * 1024 * 1024 * 1024)) * 100).toFixed(1);


  const timeAgo = (date) => {
    const diffMs = Date.now() - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minutes ago`;
    }
    return `${diffHours} hours ago`;
  };

  const statItems = [
    {
      title: "Total Files",
      value: stats.totalFiles,
      change: `+${stats.totalFilesDelta || 0}%`,
      changeType: "positive",
      icon: HardDrive,
    },
    {
      title: "Storage Used",
      value: totalSizeDisplay,
      change: `${totalSizePercent}% of 10GB`,
      changeType: "neutral",
      icon: HardDrive,
    },

    {
      title: "Security Score",
      value: `${stats.securityScore}%`,
      change: stats.securityScore >= 90 ? "Excellent" : "Moderate",
      changeType: stats.securityScore >= 90 ? "positive" : "neutral",
      icon: Shield,
    },
    {
      title: "Last Backup",
      value: timeAgo(stats.lastBackup),
      change: stats.autoSync ? "Auto-sync on" : "Auto-sync off",
      changeType: stats.autoSync ? "positive" : "neutral",
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/60 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                <p
                  className={`text-sm mt-2 ${stat.changeType === "positive"
                    ? "text-green-400"
                    : stat.changeType === "negative"
                      ? "text-red-400"
                      : "text-slate-400"
                    }`}
                >
                  {stat.change}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-xl">
                <Icon className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardHome;
