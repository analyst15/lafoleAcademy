import React, { useRef } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Copy, 
  Check, 
  Upload, 
  X, 
  Image as ImageIcon, 
  Calendar, 
  Phone, 
  FileText, 
  Lock, 
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';

export interface ManualPaymentSectionProps {
  finalPrice: number;
  orderReference: string;
  manualCurrency: 'EVC Plus' | 'eDahab' | 'ZAAD';
  setManualCurrency: (currency: 'EVC Plus' | 'eDahab' | 'ZAAD') => void;
  paymentReference: string;
  setPaymentReference: (ref: string) => void;
  amountPaid: string;
  setAmountPaid: (amount: string) => void;
  paymentDate: string;
  setPaymentDate: (date: string) => void;
  senderPhone: string;
  setSenderPhone: (phone: string) => void;
  paymentScreenshot: File | null;
  screenshotPreview: string | null;
  onScreenshotChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveScreenshot: () => void;
  onSubmitPayment: (e: React.FormEvent) => void;
  isProcessing: boolean;
  onCopy: (text: string, label: string) => void;
}

export const ManualPaymentSection: React.FC<ManualPaymentSectionProps> = ({
  finalPrice,
  orderReference,
  manualCurrency,
  setManualCurrency,
  paymentReference,
  setPaymentReference,
  amountPaid,
  setAmountPaid,
  paymentDate,
  setPaymentDate,
  senderPhone,
  setSenderPhone,
  paymentScreenshot,
  screenshotPreview,
  onScreenshotChange,
  onRemoveScreenshot,
  onSubmitPayment,
  isProcessing,
  onCopy
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          SELECT PAYMENT METHOD
        </div>
        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          Manual Processing Active
        </span>
      </div>

      {/* Payment Options Grid */}
      <div className="space-y-3">
        
        {/* OPTION 1: Credit / Debit Card (GREYED OUT) */}
        <div 
          aria-disabled="true"
          className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30 opacity-60 cursor-not-allowed select-none transition-all"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start space-x-3">
              <input
                type="radio"
                disabled
                checked={false}
                readOnly
                aria-label="Card payment is temporarily unavailable"
                className="mt-0.5 text-slate-400 cursor-not-allowed w-4 h-4"
              />
              <div className="space-y-1">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400">
                    Master Card, Credit / Debit Card
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    Temporarily Unavailable
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Payment processor integration in progress — please use manual mobile payment below
                </p>
              </div>
            </div>

            {/* Badges */}
            <div className="hidden sm:flex items-center space-x-1 opacity-50 flex-shrink-0">
              <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-extrabold text-[9px] tracking-wider">
                VISA
              </span>
              <span className="px-1.5 py-0.5 rounded bg-amber-600 text-white font-extrabold text-[9px] tracking-wider">
                MC
              </span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-700 text-white font-extrabold text-[9px] tracking-wider">
                AMEX
              </span>
            </div>
          </div>
        </div>

        {/* OPTION 2: Manual Mobile Money (ACTIVE & SELECTED) */}
        <div className="p-4 sm:p-5 rounded-2xl border-2 border-[#22C55E] bg-emerald-50/15 dark:bg-emerald-950/20 shadow-xs space-y-4">
          
          {/* Radio Header */}
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100 dark:border-emerald-900/60">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                checked={true}
                readOnly
                className="text-[#22C55E] focus:ring-[#22C55E] w-4 h-4 cursor-pointer"
              />
              <div>
                <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <Smartphone className="w-4 h-4 text-[#22C55E]" />
                  <span>Mobile Money Transfer (Somalia &amp; Somaliland)</span>
                </div>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#22C55E] text-white">
              Selected
            </span>
          </div>

          {/* Currency / Provider Selector Tabs */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Choose Currency / Payment Service:
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {(['EVC Plus', 'eDahab', 'ZAAD'] as const).map((curr) => {
                const isSelected = manualCurrency === curr;
                return (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setManualCurrency(curr)}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-normal transition-all flex items-center justify-center space-x-1.5 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#22C55E] text-white border-[#22C55E] shadow-sm scale-[1.01]'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                    }`}
                  >
                    <span className="font-normal">{curr}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================= PAYMENT INSTRUCTIONS ================= */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 space-y-3 shadow-2xs">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                PAYMENT INSTRUCTIONS
              </span>
              <span className="text-xs font-mono font-bold text-[#22C55E] bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                Send ${finalPrice} USD
              </span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              <div className="font-semibold text-slate-600 dark:text-slate-300">
                Send <strong className="text-slate-900 dark:text-white font-mono">${finalPrice}</strong> to:
              </div>

              {/* Provider details card */}
              <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl space-y-2 border border-slate-200/90 dark:border-slate-700 text-xs sm:text-sm font-medium">
                <div className="text-sm sm:text-base font-normal text-[#22C55E]">
                  {manualCurrency}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Number:</span>
                  <div className="flex items-center space-x-1.5 font-mono font-bold text-slate-900 dark:text-white">
                    <span>+252 61 9290900</span>
                    <button
                      type="button"
                      onClick={() => onCopy('+252619290900', 'Payment Number')}
                      className="text-slate-400 hover:text-[#22C55E] p-1 cursor-pointer transition-colors"
                      title="Copy phone number"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Name:</span>
                  <span className="font-bold text-slate-900 dark:text-white">Abdifatah Jama</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 dark:border-slate-700/80">
                  <span className="text-slate-500 font-medium">Reference:</span>
                  <div className="flex items-center space-x-1.5 font-mono font-black text-[#22C55E]">
                    <span>{orderReference}</span>
                    <button
                      type="button"
                      onClick={() => onCopy(orderReference, 'Order Reference')}
                      className="text-slate-400 hover:text-[#22C55E] p-1 cursor-pointer transition-colors"
                      title="Copy reference code"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ================= TRANSACTION DETAILS FORM ================= */}
          <div className="space-y-3 pt-2">
            <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              After making payment, enter your transaction details below.
            </p>

            <div className="space-y-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
              
              {/* Field 1: Payment Reference * */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Payment Reference <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="e.g. TXN948123 or SMS Reference ID"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Field 2 & 3: Amount Paid * & Payment Date * */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Amount Paid <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="text-xs font-bold text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2">$</span>
                    <input
                      type="text"
                      required
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      placeholder={String(finalPrice)}
                      className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Payment Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      required
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Field 4: Sender Phone Number * */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Sender Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="+252 61 XXXXXXX"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Field 5: Upload Payment Screenshot (Choose File) */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Upload Payment Screenshot <span className="text-slate-400 font-normal">(Optional proof)</span>
                </label>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,application/pdf"
                  onChange={onScreenshotChange}
                  className="hidden"
                />

                {!screenshotPreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-500/60 rounded-xl p-3.5 text-center cursor-pointer transition-colors bg-slate-50/60 dark:bg-slate-800/40 hover:bg-emerald-50/20"
                  >
                    <div className="flex items-center justify-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <Upload className="w-4 h-4 text-slate-400" />
                      <span>Choose File (PNG, JPG, max 8MB)</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5 truncate">
                      <ImageIcon className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {paymentScreenshot?.name || 'payment_proof.jpg'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={onRemoveScreenshot}
                      className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Notice regarding manual review */}
            <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-300 flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>
                Orders submitted via manual mobile money remain in <strong>PENDING PAYMENT VERIFICATION</strong> until our team confirms the transfer. Course access is unlocked upon verification.
              </span>
            </div>

            {/* ================= SUBMIT PAYMENT BUTTON ================= */}
            <button
              id="btn-submit-manual-payment"
              type="button"
              onClick={onSubmitPayment}
              disabled={isProcessing}
              className="w-full py-3.5 px-6 bg-[#22C55E] hover:bg-[#16A34A] disabled:opacity-50 text-white font-black text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Submitting Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>SUBMIT PAYMENT</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
