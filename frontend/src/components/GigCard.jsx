import { Link } from 'react-router-dom';
import { DollarSign, User, Calendar, ArrowRight, Briefcase, Send } from 'lucide-react';

import { useSelector } from 'react-redux';

const GigCard = ({ gig, showOwner = true }) => {
  const { user } = useSelector((state) => state.auth);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatBudget = (budget) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(budget);
  };

  return (
    <Link 
      to={`/gigs/${gig._id}`}
      className="block bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-dark-200 shadow-lg shadow-dark-200/20
                 group hover:border-primary-300 hover:shadow-primary-200/30 
                 transition-all duration-300 hover:-translate-y-1 
                 focus:outline-none focus:ring-2 focus:ring-primary-300/30
                 dark:bg-dark-900/80 dark:border-dark-800 dark:hover:border-primary-500/50"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-xl bg-primary-100 border border-primary-200 
                        group-hover:bg-primary-200 transition-colors flex-shrink-0
                        dark:bg-primary-900/30 dark:border-primary-800/50 dark:group-hover:bg-primary-900/50">
          <Briefcase className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display font-semibold text-lg text-dark-900 
                           group-hover:text-primary-600 transition-colors line-clamp-2">
              {gig.title}
            </h3>
            <span className={`flex-shrink-0 ${gig.status === 'open' ? 'status-open' : 'status-assigned'}`}>
              {gig.status}
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-dark-500 text-sm leading-relaxed line-clamp-2 mb-5">
        {gig.description}
      </p>

      <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-primary-50 border border-primary-100 dark:bg-primary-900/10 dark:border-primary-900/30">
        <DollarSign className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <span className="text-xl font-bold text-primary-600 dark:text-primary-400">{formatBudget(gig.budget)}</span>
        <span className="text-dark-400 text-sm">budget</span>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-dark-500">
        {showOwner && gig.ownerId && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 
                            flex items-center justify-center text-white text-xs font-semibold">
              {gig.ownerId.name?.charAt(0).toUpperCase()}
            </div>
            <span className="dark:text-dark-300">{gig.ownerId.name}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(gig.createdAt)}</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-dark-200 dark:border-dark-800 flex items-center justify-between">
        <span className="text-xs text-dark-400">Click to view details</span>
        {user?.role === 'seller' ? (
          <span className="btn-primary py-1.5 px-4 rounded-lg text-xs font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5" />
            Bid Now
          </span>
        ) : (
          <span className="text-sm text-primary-500 font-medium flex items-center gap-1 
                           group-hover:gap-2 transition-all">
            View Details
            <ArrowRight className="w-4 h-4" />
          </span>
        )}
      </div>
    </Link>
  );
};

export default GigCard;
