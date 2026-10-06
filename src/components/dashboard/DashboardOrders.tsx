import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowRight, CheckCircle2, Clock, FileText, Download, AlertCircle } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export interface OrderItem {
  id: string;
  date: string;
  items: string;
  amount: string;
  status: 'COMPLETED' | 'PENDING' | 'PROCESSING' | 'PENDING PAYMENT VERIFICATION';
  paymentMethod: string;
}

interface DashboardOrdersProps {
  userEmail?: string;
  onExploreCourses: () => void;
  onViewReceipt: (order: OrderItem) => void;
}

export const DashboardOrders: React.FC<DashboardOrdersProps> = ({
  userEmail,
  onExploreCourses,
  onViewReceipt
}) => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const cleanEmail = (userEmail || '').trim().toLowerCase();

    async function loadOrders() {
      if (!cleanEmail) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const retrievedOrders: OrderItem[] = [];

      try {
        const q = query(collection(db, 'enrollments'), where('email', '==', cleanEmail));
        const snap = await getDocs(q);

        snap.forEach((docSnap) => {
          const data = docSnap.data();
          // Exclude general registration records with no course enrollment
          if (data.courseId && data.courseId !== 'general-student') {
            const rawDate = data.createdAt ? new Date(data.createdAt) : new Date();
            const dateStr = !isNaN(rawDate.getTime()) 
              ? rawDate.toLocaleDateString('en-GB') 
              : new Date().toLocaleDateString('en-GB');

            const orderId = data.orderReference
              ? data.orderReference
              : (docSnap.id.startsWith('enr_')
                ? 'ORD-' + docSnap.id.replace('enr_', '').substring(0, 8).toUpperCase()
                : (data.id ? 'ORD-' + String(data.id).substring(0, 8).toUpperCase() : `ORD-${docSnap.id.substring(0, 8).toUpperCase()}`));

            const amt = data.amount !== undefined 
              ? (typeof data.amount === 'number' ? `$${data.amount.toFixed(2)}` : (String(data.amount).startsWith('$') ? data.amount : `$${data.amount}`))
              : '$0.00';

            const isDone = data.paymentStatus === 'completed' || data.status === 'enrolled';
            const orderStatus = isDone 
              ? 'COMPLETED' 
              : (data.status === 'pending_payment_verification' ? 'PENDING PAYMENT VERIFICATION' : 'PENDING');

            let method = 'Online Payment';
            if (data.paymentMethod === 'card') method = 'Credit / Debit Card';
            else if (['EVC Plus', 'eDahab', 'ZAAD'].includes(data.paymentMethod)) method = `${data.paymentMethod} (Manual Transfer)`;
            else if (data.paymentMethod === 'mobile_money') method = 'Mobile Money (EVC Plus / Zaad)';
            else if (data.paymentMethod) method = data.paymentMethod;

            retrievedOrders.push({
              id: orderId,
              date: dateStr,
              items: data.courseTitle || 'Diploma Program Track',
              amount: amt,
              status: orderStatus,
              paymentMethod: method
            });
          }
        });
      } catch (err) {
        console.warn("Could not query orders from Firestore:", err);
      }

      // Check local storage for recent enrollment matching this user
      if (retrievedOrders.length === 0 && typeof localStorage !== 'undefined') {
        const localEnr = localStorage.getItem('last_lafole_enrollment');
        if (localEnr) {
          try {
            const parsed = JSON.parse(localEnr);
            if (
              parsed.email?.toLowerCase() === cleanEmail && 
              parsed.courseId && 
              parsed.courseId !== 'general-student' &&
              (parsed.paymentStatus === 'completed' || parsed.status === 'enrolled' || parsed.status === 'pending_payment_verification')
            ) {
              const isPaid = parsed.paymentStatus === 'completed' || parsed.status === 'enrolled';
              retrievedOrders.push({
                id: parsed.orderReference || (parsed.enrollmentId ? 'ORD-' + parsed.enrollmentId.replace('enr_', '').substring(0, 8).toUpperCase() : 'ORD-LOCAL-01'),
                date: parsed.paymentDate || new Date().toLocaleDateString('en-GB'),
                items: parsed.courseTitle || 'Enrolled Track',
                amount: parsed.amount ? `$${Number(parsed.amount).toFixed(2)}` : '$0.00',
                status: isPaid ? 'COMPLETED' : 'PENDING PAYMENT VERIFICATION',
                paymentMethod: parsed.paymentMethod ? `${parsed.paymentMethod} (Manual Transfer)` : 'Manual Transfer'
              });
            }
          } catch {}
        }
      }

      if (isMounted) {
        setOrders(retrievedOrders);
        setIsLoading(false);
      }
    }

    loadOrders();
    return () => { isMounted = false; };
  }, [userEmail]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-[20px] sm:text-[22px] font-[600] uppercase tracking-tight text-slate-900 dark:text-white">
          MY ORDERS
        </h1>
        <p className="text-[14.5px] font-[400] text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Order history, payment confirmations, and downloadable tax invoices.
        </p>
      </div>

      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-400 text-sm">
          Loading your order history...
        </div>
      ) : orders.length === 0 ? (
        /* Clean Zero State: No default fake orders for newly registered or empty accounts */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No orders placed yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              When you enroll in courses or diploma programs, your orders, invoices, and payment receipts will appear here.
            </p>
          </div>
          <button
            onClick={onExploreCourses}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <span>Explore Course Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <>
          {/* Mobile Card View (hidden on md and up) */}
          <div className="md:hidden space-y-3.5">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-[600] text-[14px] text-slate-900 dark:text-white">
                    {order.id}
                  </span>
                  {order.status === 'COMPLETED' ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-[600] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>COMPLETED</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-[600] bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                      <Clock className="w-3 h-3" />
                      <span>PENDING</span>
                    </span>
                  )}
                </div>

                <div>
                  <div className="font-[500] text-[15px] text-slate-900 dark:text-white leading-snug">
                    {order.items}
                  </div>
                  <div className="text-[13px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>{order.date} • {order.paymentMethod}</span>
                    <span className="font-[700] text-[15px] text-slate-900 dark:text-white">{order.amount}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => onViewReceipt(order)}
                    className="inline-flex items-center space-x-1.5 text-[13.5px] font-[500] text-[#22C55E] hover:underline cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Receipt</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (hidden on mobile) */}
          <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13.5px]">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-[600] uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-5">ORDER ID</th>
                    <th className="py-3.5 px-4">DATE</th>
                    <th className="py-3.5 px-4">ITEMS</th>
                    <th className="py-3.5 px-4">PAYMENT METHOD</th>
                    <th className="py-3.5 px-4">AMOUNT</th>
                    <th className="py-3.5 px-4">STATUS</th>
                    <th className="py-3.5 px-5 text-right">RECEIPT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-5 font-mono font-[600] text-slate-900 dark:text-white">
                        {order.id}
                      </td>
                      <td className="py-4 px-4 text-slate-500 font-[400]">{order.date}</td>
                      <td className="py-4 px-4 font-[500] text-slate-800 dark:text-slate-200 max-w-[240px] truncate">
                        {order.items}
                      </td>
                      <td className="py-4 px-4 text-slate-500 font-[400]">{order.paymentMethod}</td>
                      <td className="py-4 px-4 font-[600] text-slate-900 dark:text-white">{order.amount}</td>
                      <td className="py-4 px-4">
                        {order.status === 'COMPLETED' ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-[600] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>COMPLETED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-[600] bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <Clock className="w-3 h-3" />
                            <span>PENDING</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => onViewReceipt(order)}
                          className="inline-flex items-center space-x-1 text-[13.5px] font-[500] text-[#22C55E] hover:underline cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
