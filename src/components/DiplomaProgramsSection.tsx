import React from 'react';
import { 
  Star, 
  ArrowRight, 
  ArrowUpRight, 
  Palette, 
  Globe, 
  TrendingUp, 
  Server,
  Layers,
  GraduationCap
} from 'lucide-react';
import { Course } from '../types';

interface DiplomaProgramsSectionProps {
  onSelectTrack?: (trackName: string) => void;
  onExploreAll?: () => void;
}

interface DiplomaItem {
  id: string;
  title: string;
  coursesCount: number;
  monthsCount: number;
  lessonsCount?: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  category: string;
}

export const DiplomaProgramsSection: React.FC<DiplomaProgramsSectionProps> = ({
  onSelectTrack,
  onExploreAll
}) => {
  const standardDiplomas: DiplomaItem[] = [
    {
      id: 'diploma-design',
      title: 'Graphic Design Diploma',
      coursesCount: 7,
      monthsCount: 6,
      icon: Palette,
      iconBg: 'bg-pink-50 dark:bg-pink-950/40',
      iconColor: 'text-pink-500 dark:text-pink-400',
      category: 'Design & Media'
    },
    {
      id: 'diploma-english',
      title: 'English Foundation Diploma',
      coursesCount: 5,
      monthsCount: 4,
      icon: Globe,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      category: 'Language & Communication'
    },
    {
      id: 'diploma-marketing',
      title: 'Digital Marketing Diploma',
      coursesCount: 8,
      monthsCount: 5,
      icon: TrendingUp,
      iconBg: 'bg-amber-50 dark:bg-amber-950/40',
      iconColor: 'text-amber-500 dark:text-amber-400',
      category: 'Growth & Marketing'
    },
    {
      id: 'diploma-network',
      title: 'Network Infrastructure Diploma',
      coursesCount: 9,
      monthsCount: 6,
      icon: Server,
      iconBg: 'bg-sky-50 dark:bg-sky-950/40',
      iconColor: 'text-sky-500 dark:text-sky-400',
      category: 'Infrastructure & DevOps'
    }
  ];

  return (
    <section className="w-full py-14 sm:py-20 bg-[#F9F9F8] dark:bg-[#0A0E17] border-t border-slate-200/70 dark:border-slate-800/80 transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 sm:pb-12 gap-5">
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              DIPLOMA TRACKS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Lafole Diploma <span className="font-serif italic font-normal text-slate-800 dark:text-slate-200">Programs.</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Each diploma is a structured curriculum with multiple courses, real projects, and an accredited certificate on completion.
            </p>
          </div>

          <button
            onClick={onExploreAll}
            className="group self-start sm:self-auto flex items-center space-x-2 px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer flex-shrink-0"
          >
            <span>All diplomas</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Asymmetric Diploma Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-stretch">
          
          {/* Featured Card (Left Side, 5 columns) */}
          <div 
            onClick={() => onSelectTrack && onSelectTrack('IT Support Pro Diploma')}
            className="lg:col-span-5 group rounded-3xl bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800 p-5 sm:p-9 shadow-xs hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden"
          >
            {/* Subtle background glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Badge: Featured Track */}
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 shadow-2xs">
                <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600 dark:fill-emerald-400 dark:text-emerald-400" />
                <span className="tracking-wide uppercase text-[10px] sm:text-xs">FEATURED TRACK</span>
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                IT Support Pro Diploma
              </h3>

              {/* Somali description from original reference */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3.5 leading-relaxed">
                Si aad lugta ula gasho gayiga shaqooyinka IT-ga waxaa waxbarataa Xirfadaan IT Support Professional si aad unoqoto qof samayn kara computerada, cilad saari kara, isku xiri kara, Network-yada iyo server-yada casriga ah maamuli kara.
              </p>

              {/* CTA Button */}
              <div className="mt-7">
                <button
                  type="button"
                  className="px-6 py-3 bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs sm:text-sm font-semibold rounded-full inline-flex items-center space-x-2 shadow-lg shadow-emerald-500/25 transition-all group-hover:scale-[1.02] cursor-pointer"
                >
                  <span>Start the track</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Divider & Stats Footer */}
            <div className="mt-8 pt-7 border-t border-slate-100 dark:border-slate-800/90">
              <div className="grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    6
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                    MONTHS
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    11
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                    COURSES
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    1,043
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                    LESSONS
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Standard Diplomas Sub-Grid (Right Side, 7 columns) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {standardDiplomas.map((diploma) => {
              const IconComp = diploma.icon;

              return (
                <div
                  key={diploma.id}
                  onClick={() => onSelectTrack && onSelectTrack(diploma.title)}
                  className="group rounded-2xl bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs hover:shadow-lg hover:border-emerald-500/40 dark:hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  {/* Top Row: Icon Box and Arrow Action */}
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-xl ${diploma.iconBg} ${diploma.iconColor} flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}>
                      <IconComp className="w-5 h-5" />
                    </div>

                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/60 flex items-center justify-center transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Bottom Content: Title & Duration Meta */}
                  <div className="mt-8">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {diploma.title}
                    </h4>

                    <div className="mt-2 text-sm sm:text-[15px] font-medium text-slate-500 dark:text-slate-400">
                      <span>{diploma.coursesCount} courses</span>
                      <span className="mx-1.5 text-slate-300 dark:text-slate-700">·</span>
                      <span>{diploma.monthsCount} mo</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
