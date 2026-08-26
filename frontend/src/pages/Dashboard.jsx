import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Briefcase, 
  Send, 
  PlusCircle, 
  Eye,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign,
  ArrowRight,
  Calendar,
  ShoppingBag,
  Users,
  Repeat
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchMyGigs } from '../store/slices/gigSlice';
import { fetchMyBids } from '../store/slices/bidSlice';
import { switchRole } from '../store/slices/authSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myGigs } = useSelector((state) => state.gigs);
  const { myBids } = useSelector((state) => state.bids);

  const currentRole = user?.role || 'buyer';

  useEffect(() => {
    dispatch(fetchMyGigs());
    dispatch(fetchMyBids());
  }, [dispatch]);

  const handleRoleToggle = async () => {
    const nextRole = currentRole === 'buyer' ? 'seller' : 'buyer';
    try {
      await dispatch(switchRole(nextRole)).unwrap();
      toast.success(`Switched to ${nextRole === 'buyer' ? 'Client' : 'Freelancer'} mode!`);
    } catch (err) {
      toast.error(err || 'Failed to switch role');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Buyer Specific Stats & Actions
  const buyerStats = [
    {
      label: 'Posted Job Listings',
      value: myGigs.length,
      icon: FileText,
      color: 'from-amber-400 to-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      label: 'Open for Bids',
      value: myGigs.filter(g => g.status === 'open').length,
      icon: Clock,
      color: 'from-primary-400 to-primary-500',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600',
    },
    {
      label: 'Hired Freelancers',
      value: myGigs.filter(g => g.status === 'assigned').length,
      icon: CheckCircle,
      color: 'from-green-400 to-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      label: 'Total Budget Committed',
      value: `$${myGigs.reduce((acc, g) => acc + (g.budget || 0), 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'from-purple-400 to-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  const buyerQuickActions = [
    {
      title: 'Post a New Gig',
      description: 'Create a job listing to find top freelancers',
      icon: PlusCircle,
      path: '/gigs/create',
      color: 'from-primary-400 to-primary-500',
    },
    {
      title: 'Manage My Gigs',
      description: 'Review job posts and applicant proposals',
      icon: FileText,
      path: '/my-gigs',
      color: 'from-amber-400 to-amber-500',
    },
    {
      title: 'Browse Freelance Market',
      description: 'Explore available services and market trends',
      icon: Eye,
      path: '/gigs',
      color: 'from-blue-400 to-blue-500',
    },
  ];

  // Seller Specific Stats & Actions
  const sellerStats = [
    {
      label: 'Proposals Submitted',
      value: myBids.length,
      icon: Send,
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Pending Proposals',
      value: myBids.filter(b => b.status === 'pending').length,
      icon: Clock,
      color: 'from-amber-400 to-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      label: 'Contracts Won (Hired)',
      value: myBids.filter(b => b.status === 'hired').length,
      icon: CheckCircle,
      color: 'from-green-400 to-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      label: 'Potential Revenue',
      value: `$${myBids.filter(b => b.status === 'hired').reduce((acc, b) => acc + (b.price || 0), 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'from-emerald-400 to-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
  ];

  const sellerQuickActions = [
    {
      title: 'Browse Available Gigs',
      description: 'Find new job opportunities and submit bids',
      icon: Briefcase,
      path: '/gigs',
      color: 'from-blue-400 to-blue-500',
    },
    {
      title: 'Track My Submitted Bids',
      description: 'Check status of your active proposals',
      icon: Send,
      path: '/my-bids',
      color: 'from-green-400 to-green-500',
    },
    {
      title: 'Post a Custom Offer',
      description: 'Create a gig listing to showcase your skill',
      icon: PlusCircle,
      path: '/gigs/create',
      color: 'from-purple-400 to-purple-500',
    },
  ];

  const currentStats = currentRole === 'buyer' ? buyerStats : sellerStats;
  const currentActions = currentRole === 'buyer' ? buyerQuickActions : sellerQuickActions;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner with Role Indicator & Switcher */}
      <div className="bg-white/80 backdrop-blur-xl border border-dark-200 rounded-2xl p-6 shadow-lg shadow-dark-200/10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                currentRole === 'buyer'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50'
                  : 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50'
              }`}>
                {currentRole === 'buyer' ? <ShoppingBag className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                {currentRole === 'buyer' ? 'Client Dashboard' : 'Freelancer Dashboard'}
              </span>
            </div>
            <h1 className="font-display font-bold text-3xl text-dark-900 mb-1">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-dark-500 text-sm">
              {currentRole === 'buyer' 
                ? 'Manage your posted job listings, review applicant proposals, and hire top talent.' 
                : 'Discover open gigs, track your active bids, and manage your freelancing contracts.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRoleToggle}
              className="btn-secondary flex items-center gap-2 text-xs font-semibold py-2.5 px-4 shadow-sm"
            >
              <Repeat className="w-4 h-4 text-primary-500" />
              Switch to {currentRole === 'buyer' ? 'Freelancer' : 'Client'} View
            </button>
            {currentRole === 'buyer' ? (
              <Link to="/gigs/create" className="btn-primary flex items-center gap-2 whitespace-nowrap text-sm py-2.5 px-4">
                <PlusCircle className="w-4 h-4" />
                Post a Gig
              </Link>
            ) : (
              <Link to="/gigs" className="btn-primary flex items-center gap-2 whitespace-nowrap text-sm py-2.5 px-4">
                <Eye className="w-4 h-4" />
                Browse Gigs
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Role Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {currentStats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white/80 rounded-2xl p-5 border border-dark-200 shadow-lg shadow-dark-200/10 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`p-3.5 rounded-2xl ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-900">{stat.value}</p>
              <p className="text-xs font-medium text-dark-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Role Quick Actions */}
      <div>
        <h2 className="font-display font-semibold text-xl text-dark-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-500" />
          Quick Actions for {currentRole === 'buyer' ? 'Clients' : 'Freelancers'}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {currentActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="bg-white/80 rounded-2xl p-5 border border-dark-200 shadow-lg shadow-dark-200/10 
                        group hover:border-primary-300 hover:shadow-primary-200/20 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 
                              group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-dark-900 mb-1 group-hover:text-primary-600 transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-dark-500">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Role Tailored Content Section */}
      {currentRole === 'buyer' ? (
        /* Buyer Dashboard Content: Focus on Posted Gigs & Applicant Management */
        <div className="bg-white/80 backdrop-blur-xl border border-dark-200 rounded-2xl p-6 shadow-lg shadow-dark-200/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-semibold text-lg text-dark-900 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-50">
                  <FileText className="w-5 h-5 text-amber-600" />
                </div>
                Your Posted Job Listings
              </h2>
              <p className="text-xs text-dark-500 mt-1">Review your posted gigs and click to manage incoming proposals</p>
            </div>
            <Link to="/my-gigs" className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1 group">
              View all ({myGigs.length})
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {myGigs.length === 0 ? (
            <div className="text-center py-12 bg-dark-50 rounded-xl">
              <Briefcase className="w-12 h-12 text-dark-300 mx-auto mb-3" />
              <p className="text-dark-500 mb-2">You haven't posted any job listings yet</p>
              <Link to="/gigs/create" className="text-primary-500 hover:text-primary-600 text-sm font-medium inline-flex items-center gap-1">
                Post your first job listing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myGigs.slice(0, 5).map((gig) => (
                <Link
                  key={gig._id}
                  to={`/gigs/${gig._id}`}
                  className="block p-4 rounded-xl border border-dark-200 bg-white 
                             hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-dark-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                          {gig.title}
                        </h3>
                        <span className={`text-xs flex-shrink-0 ${gig.status === 'open' ? 'status-open' : 'status-assigned'}`}>
                          {gig.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-dark-500">
                        <span className="flex items-center gap-1 text-dark-700 font-medium">
                          <DollarSign className="w-3.5 h-3.5 text-primary-500" />
                          Budget: ${gig.budget.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-dark-400" />
                          Posted {formatDate(gig.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg group-hover:bg-primary-100 transition-colors">
                      <Users className="w-3.5 h-3.5" />
                      <span>Review Bids</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Seller Dashboard Content: Focus on Submitted Proposals & Contracts */
        <div className="bg-white/80 backdrop-blur-xl border border-dark-200 rounded-2xl p-6 shadow-lg shadow-dark-200/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-semibold text-lg text-dark-900 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Send className="w-5 h-5 text-blue-500" />
                </div>
                Your Submitted Proposals & Bids
              </h2>
              <p className="text-xs text-dark-500 mt-1">Track bid status and communicate with clients on active orders</p>
            </div>
            <Link to="/my-bids" className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1 group">
              View all ({myBids.length})
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {myBids.length === 0 ? (
            <div className="text-center py-12 bg-dark-50 rounded-xl">
              <Send className="w-12 h-12 text-dark-300 mx-auto mb-3" />
              <p className="text-dark-500 mb-2">No bids submitted yet</p>
              <Link to="/gigs" className="text-primary-500 hover:text-primary-600 text-sm font-medium inline-flex items-center gap-1">
                Browse open market gigs
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myBids.slice(0, 5).map((bid) => (
                <Link
                  key={bid._id}
                  to={`/gigs/${bid.gigId?._id}`}
                  className={`block p-4 rounded-xl border transition-all group ${
                    bid.status === 'hired'
                      ? 'border-green-200 bg-green-50/40 hover:bg-green-100/50'
                      : bid.status === 'rejected'
                      ? 'border-dark-200 bg-dark-50/40'
                      : 'border-blue-200 bg-blue-50/40 hover:bg-blue-100/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-dark-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                          {bid.gigId?.title || 'Gig Listing'}
                        </h3>
                        <span className={`text-xs flex-shrink-0 status-${bid.status}`}>
                          {bid.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-dark-500">
                        <span className="flex items-center gap-1 text-primary-600 font-semibold">
                          <DollarSign className="w-3.5 h-3.5" />
                          Bid Price: ${bid.price.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-dark-400" />
                          Submitted {formatDate(bid.createdAt)}
                        </span>
                      </div>
                    </div>
                    {bid.status === 'hired' && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Contract Hired</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
