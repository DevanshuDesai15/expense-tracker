import React from 'react';
import { Home, Zap, DollarSign, Activity, ArrowRight, Clock } from 'lucide-react';
import { format } from 'date-fns';

const StatCard = ({ icon, title, value, subtitle, iconBgColor, iconColor, valueColor }) => {
    const Icon = icon;
    return (
      <div className="bg-slate-800/50 border border-cyan-500/10 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <p className="text-slate-300">{title}</p>
          <div className={`p-2 rounded-lg ${iconBgColor}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        </div>
        <div>
          <h2 className={`text-4xl font-bold ${valueColor}`}>{value}</h2>
          <p className="text-slate-400 text-sm">{subtitle}</p>
        </div>
      </div>
    );
};

const ActivityItem = ({ icon, text, time, iconBgColor, iconColor }) => {
    const Icon = icon;
    return (
        <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
            <div className={`p-3 rounded-full ${iconBgColor}`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
                <p className="text-slate-200">{text}</p>
                <p className="text-slate-500 text-sm">{time}</p>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const today = format(new Date(), "eeee, MMMM d, yyyy");

    return (
        <div className="text-white">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="text-slate-400">Here's what's happening with your home today.</p>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                    <span>{today}</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                <StatCard 
                    icon={Home} 
                    title="Active Devices" 
                    value="12" 
                    subtitle="3 devices online" 
                    iconBgColor="bg-blue-500/20"
                    iconColor="text-blue-300"
                    valueColor="text-blue-400"
                />
                <StatCard 
                    icon={Zap} 
                    title="Automations" 
                    value="8" 
                    subtitle="5 running" 
                    iconBgColor="bg-purple-500/20"
                    iconColor="text-purple-300"
                    valueColor="text-purple-400"
                />
                <StatCard 
                    icon={DollarSign} 
                    title="This Month" 
                    value="$2,450" 
                    subtitle="+12% from last month"
                    iconBgColor="bg-green-500/20"
                    iconColor="text-green-300"
                    valueColor="text-green-400"
                />
                <StatCard 
                    icon={Activity} 
                    title="Energy Usage" 
                    value="245 kWh" 
                    subtitle="-8% from last month"
                    iconBgColor="bg-orange-500/20"
                    iconColor="text-orange-300"
                    valueColor="text-orange-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-800/50 border border-cyan-500/10 rounded-2xl p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg text-slate-200">Recent Activity</h3>
                        <button className="flex items-center space-x-1 text-sm text-cyan-400 hover:text-cyan-300">
                            <span>View All</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-2">
                        <ActivityItem 
                            icon={Home}
                            text="Living Room Lights turned on"
                            time="2 minutes ago"
                            iconBgColor="bg-blue-500/20"
                            iconColor="text-blue-300"
                        />
                        <ActivityItem 
                            icon={Zap}
                            text="Morning Routine automation executed"
                            time="6 hours ago"
                            iconBgColor="bg-purple-500/20"
                            iconColor="text-purple-300"
                        />
                        <ActivityItem 
                            icon={DollarSign}
                            text="Expense added: Groceries"
                            time="1 day ago"
                            iconBgColor="bg-green-500/20"
                            iconColor="text-green-300"
                        />
                    </div>
                </div>

                <div className="bg-slate-800/50 border border-cyan-500/10 rounded-2xl p-6 shadow-lg">
                    <h3 className="font-semibold text-lg text-slate-200 mb-4 flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                        <span>Quick Stats</span>
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-transparent">
                            <span className="text-sm text-slate-400">Devices Online</span>
                            <span className="text-sm text-cyan-400">9/12</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-transparent">
                            <span className="text-sm text-slate-400">Active Automations</span>
                            <span className="text-sm text-purple-400">5/8</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-green-500/10 to-transparent">
                            <span className="text-sm text-slate-400">Weekly Expenses</span>
                            <span className="text-sm text-green-400">$485</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-orange-500/10 to-transparent">
                            <span className="text-sm text-slate-400">Budget Remaining</span>
                            <span className="text-sm text-orange-400">$1,550</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
