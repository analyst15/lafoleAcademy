import React, { useState, useEffect } from 'react';
import { CreditCard, Download, FileText, CheckCircle2, Clock, Printer, X, ShieldCheck } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { formatStudentDisplayName } from '../../utils/userUtils';

interface PaymentTransaction {
  id: string;
  date: string;
  product: string;
  amount: string;
  status: 'PENDING' | 'PAID' | 'REFUNDED';
  method: string;
}

interface DashboardPaymentsProps {
  userEmail: string;
  userName: string;
}

export const DashboardPayments: React.FC<DashboardPaymentsProps> = ({
  userEmail,
  userName
}) => {
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const cleanEmail = (userEmail || '').trim().toLowerCase();

    async function loadPayments() {
      if (!cleanEmail) {
        setTransactions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const retrievedTxns: PaymentTransaction[] = [];

      try {
        const q = query(collection(db, 'enrollments'), where('email', '==', cleanEmail));
        const snap = await getDocs(q);

        snap.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.courseId && data.courseId !== 'general-student') {
            const rawDate = data.createdAt ? new Date(data.createdAt) : new Date();
            const dateStr = !isNaN(rawDate.getTime()) 
              ? rawDate.toLocaleDateString('en-GB') 
              : new Date().toLocaleDateString('en-GB');

            const txnId = docSnap.id.startsWith('enr_')
              ? 'TXN-' + docSnap.id.replace('enr_', '').substring(0, 8).toUpperCase()
              : (data.transactionRef || `TXN-${docSnap.id.substring(0, 8).toUpperCase()}`);

            const amt = data.amount !== undefined 
              ? (typeof data.amount === 'number' ? `$${data.amount.toFixed(2)}` : (String(data.amount).startsWith('$') ? data.amount : `$${data.amount}`))
              : '$0.00';

            const isPaid = data.paymentStatus === 'completed' || data.status === 'enrolled';

            let method = 'Credit / Debit Card';
            if (data.paymentMethod === 'mobile_money') method = 'Mobile Money (EVC Plus / Zaad)';
            else if (data.paymentMethod === 'card') method = 'Credit / Debit Card';
            else if (data.paymentMethod) method = data.paymentMethod;

            retrievedTxns.push({
              id: txnId,
              date: dateStr,
              product: data.courseTitle || 'Diploma Program Track',
              amount: amt,
              status: isPaid ? 'PAID' : 'PENDING',
              method: method
            });
          }
        });
      } catch (err) {
        console.warn("Could not load payment transactions from Firestore:", err);
      }

      // Check local storage fallback for recent enrollment
      if (retrievedTxns.length === 0 && typeof localStorage !== 'undefined') {
        const localEnr = localStorage.getItem('last_lafole_enrollment');
        if (localEnr) {
          try {
            const parsed = JSON.parse(localEnr);
            if (
              parsed.email?.toLowerCase() === cleanEmail && 
              parsed.courseId && 
              parsed.courseId !== 'general-student' &&
              (parsed.paymentStatus === 'completed' || parsed.status === 'enrolled')
            ) {
              retrievedTxns.push({
                id: parsed.enrollmentId ? 'TXN-' + parsed.enrollmentId.replace('enr_', '').substring(0, 8).toUpperCase() : 'TXN-LOCAL-01',
                date: new Date().toLocaleDateString('en-GB'),
                product: parsed.courseTitle || 'Enrolled Course Track',
                amount: parsed.amount ? `$${Number(parsed.amount).toFixed(2)}` : '$0.00',
                status: 'PAID',
                method: parsed.paymentMethod || 'Credit / Debit Card'
              });
            }
          } catch {}
        }
      }

      if (isMounted) {
        setTransactions(retrievedTxns);
        setIsLoading(false);
      }
    }

    loadPayments();
    return () => { isMounted = false; };
  }, [userEmail]);

  const totalPaid = transactions
    .filter(t => t.status === 'PAID')
    .reduce((acc, t) => acc + (parseFloat(t.amount.replace(/[^0-9.]/g, '')) || 0), 0);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header matching Payments.PNG */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-[20px] sm:text-[22px] font-[600] uppercase tracking-tight text-slate-900 dark:text-white">
          PAYMENTS
        </h1>
        <p className="text-[14.5px] font-[400] text-slate-600 dark:text-slate-300 mt-1">
          <span className="font-[600] text-slate-900 dark:text-white">${totalPaid.toFixed(2)}</span> paid across {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}.
        </p>
        <p className="text-[13.5px] text-slate-500 dark:text-slate-400 mt-0.5">
          Each completed row can be printed or saved as a PDF for your finance records.
        </p>
      </div>

      {/* Stats Summary Cards matching Payments.PNG */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-1">
          <div className="text-2xl sm:text-3xl font-[700] text-slate-900 dark:text-white">
            {transactions.length}
          </div>
          <div className="text-[11px] font-[600] text-slate-400 uppercase tracking-wider">
            TRANSACTIONS
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-1">
          <div className="text-2xl sm:text-3xl font-[700] text-slate-900 dark:text-white">
            ${totalPaid.toFixed(2)}
          </div>
          <div className="text-[11px] font-[600] text-slate-400 uppercase tracking-wider">
            TOTAL PAID
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-400 text-sm">
          Loading payment records...
        </div>
      ) : transactions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <CreditCard className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No payment transactions yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              When you purchase or enroll in paid courses or diploma programs, your payment invoices and downloadable receipts will appear here.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Card View (hidden on md and up) */}
          <div className="md:hidden space-y-3.5">
            {transactions.map(txn => (
              <div
                key={txn.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[13px] text-slate-500 font-[400]">{txn.date}</span>
                  {txn.status === 'PAID' ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[11px] font-[600] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>PAID</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[11px] font-[600] bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                      <Clock className="w-3 h-3" />
                      <span>PENDING</span>
                    </span>
                  )}
                </div>

                <div>
                  <div className="font-[500] text-[15px] text-slate-900 dark:text-white leading-snug">
                    {txn.product}
                  </div>
                  <div className="text-[13px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>{txn.method}</span>
                    <span className="font-[700] text-[15px] text-slate-900 dark:text-white">{txn.amount}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => setSelectedReceipt(txn)}
                    className="inline-flex items-center space-x-1.5 text-[13.5px] font-[500] text-[#22C55E] hover:underline cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Transactions Table matching Payments.PNG (hidden on mobile) */}
          <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13.5px]">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-[600] uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-5">DATE</th>
                    <th className="py-3.5 px-4">PRODUCT</th>
                    <th className="py-3.5 px-4">AMOUNT</th>
                    <th className="py-3.5 px-4">STATUS</th>
                    <th className="py-3.5 px-5 text-right">RECEIPT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {transactions.map(txn => (
                    <tr key={txn.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-5 text-slate-500 font-mono text-[13px]">
                        {txn.date}
                      </td>
                      <td className="py-4 px-4 font-[500] text-slate-800 dark:text-slate-200">
                        {txn.product}
                      </td>
                      <td className="py-4 px-4 font-[600] text-slate-900 dark:text-white">
                        {txn.amount}
                      </td>
                      <td className="py-4 px-4">
                        {txn.status === 'PAID' ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[11px] font-[600] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>PAID</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[11px] font-[600] bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <Clock className="w-3 h-3" />
                            <span>PENDING</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => setSelectedReceipt(txn)}
                          className="inline-flex items-center space-x-1 text-[13.5px] font-[500] text-[#22C55E] hover:underline cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Receipt</span>
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

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#22C55E] text-white font-black flex items-center justify-center text-sm">
                  L
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Lafole Academy</h3>
                  <p className="text-[10px] text-slate-400">Payment Invoice & Receipt</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl font-mono">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedReceipt.id}</span>
              </div>

              <div className="space-y-2 divide-y divide-slate-100 dark:divide-slate-800">
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{formatStudentDisplayName(userName, userEmail)}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{userEmail || 'student@lafole.so'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="text-slate-800 dark:text-slate-200">{selectedReceipt.date} (EAT)</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Enrolled Item:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 max-w-[220px] text-right truncate">
                    {selectedReceipt.product}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Payment Method:</span>
                  <span className="text-slate-800 dark:text-slate-200">{selectedReceipt.method}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{selectedReceipt.status}</span>
                </div>
                <div className="flex justify-between py-2 text-sm font-bold">
                  <span className="text-slate-900 dark:text-white">Amount Total:</span>
                  <span className="text-[#22C55E] font-black">{selectedReceipt.amount}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
