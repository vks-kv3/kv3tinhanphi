/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Calculator, Gavel, Scale, Briefcase, Info, RefreshCw, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type DisputeType = 'CIVIL' | 'BUSINESS' | 'LABOR';

interface CalculationResult {
  courtFee: number;
  mediationFee: number;
  formula: string;
}

export default function App() {
  const [disputeType, setDisputeType] = useState<DisputeType>('CIVIL');
  const [hasValue, setHasValue] = useState<boolean>(false);
  const [monetaryValue, setMonetaryValue] = useState<string>('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const result = useMemo((): CalculationResult | null => {
    const valueNum = parseFloat(monetaryValue.replace(/[^0-9]/g, '')) || 0;

    if (!hasValue) {
      let fee = 0;
      let formula = '';
      if (disputeType === 'CIVIL' || disputeType === 'LABOR') {
        fee = 300000;
        formula = 'Án phí dân sự không có giá ngạch: 300.000đ';
      } else if (disputeType === 'BUSINESS') {
        fee = 3000000;
        formula = 'Án phí kinh doanh thương mại không có giá ngạch: 3.000.000đ';
      }
      return { courtFee: fee, mediationFee: fee * 0.5, formula };
    }

    if (valueNum <= 0) return null;

    let fee = 0;
    let formula = '';

    if (disputeType === 'CIVIL') {
      if (valueNum <= 6000000) {
        fee = 300000;
        formula = 'Từ 6.000.000đ trở xuống: 300.000đ';
      } else if (valueNum <= 400000000) {
        fee = valueNum * 0.05;
        formula = `Từ trên 6.000.000đ đến 400.000.000đ: 5% giá trị tranh chấp`;
      } else if (valueNum <= 800000000) {
        fee = 20000000 + (valueNum - 400000000) * 0.04;
        formula = `Từ trên 400.000.000đ đến 800.000.000đ: 20.000.000đ + 4% của phần giá trị vượt 400.000.000đ`;
      } else if (valueNum <= 2000000000) {
        fee = 36000000 + (valueNum - 800000000) * 0.03;
        formula = `Từ trên 800.000.000đ đến 2.000.000.000đ: 36.000.000đ + 3% của phần giá trị vượt 800.000.000đ`;
      } else if (valueNum <= 4000000000) {
        fee = 72000000 + (valueNum - 2000000000) * 0.02;
        formula = `Từ trên 2.000.000.000đ đến 4.000.000.000đ: 72.000.000đ + 2% của phần giá trị vượt 2.000.000.000đ`;
      } else {
        fee = 112000000 + (valueNum - 4000000000) * 0.001;
        formula = `Từ trên 4.000.000.000đ: 112.000.000đ + 0,1% của phần giá trị vượt 4.000.000.000đ`;
      }
    } else if (disputeType === 'BUSINESS') {
      if (valueNum <= 60000000) {
        fee = 3000000;
        formula = 'Từ 60.000.000đ trở xuống: 3.000.000đ';
      } else if (valueNum <= 400000000) {
        fee = valueNum * 0.05;
        formula = `Từ trên 60.000.000đ đến 400.000.000đ: 5% giá trị tranh chấp`;
      } else if (valueNum <= 800000000) {
        fee = 20000000 + (valueNum - 400000000) * 0.04;
        formula = `Từ trên 400.000.000đ đến 800.000.000đ: 20.000.000đ + 4% của phần giá trị vượt 400.000.000đ`;
      } else if (valueNum <= 2000000000) {
        fee = 36000000 + (valueNum - 800000000) * 0.03;
        formula = `Từ trên 800.000.000đ đến 2.000.000.000đ: 36.000.000đ + 3% của phần giá trị vượt 800.000.000đ`;
      } else if (valueNum <= 4000000000) {
        fee = 72000000 + (valueNum - 2000000000) * 0.02;
        formula = `Từ trên 2.000.000.000đ đến 4.000.000.000đ: 72.000.000đ + 2% của phần giá trị vượt 2.000.000.000đ`;
      } else {
        fee = 112000000 + (valueNum - 4000000000) * 0.001;
        formula = `Từ trên 4.000.000.000đ: 112.000.000đ + 0,1% của phần giá trị vượt 4.000.000.000đ`;
      }
    } else if (disputeType === 'LABOR') {
      if (valueNum <= 6000000) {
        fee = 300000;
        formula = 'Từ 6.000.000đ trở xuống: 300.000đ';
      } else if (valueNum <= 400000000) {
        fee = valueNum * 0.03;
        if (fee < 300000) fee = 300000;
        formula = `Từ trên 6.000.000đ đến 400.000.000đ: 3% giá trị tranh chấp (không thấp hơn 300.000đ)`;
      } else if (valueNum <= 2000000000) {
        fee = 12000000 + (valueNum - 400000000) * 0.02;
        formula = `Từ trên 400.000.000đ đến 2.000.000.000đ: 12.000.000đ + 2% của phần giá trị vượt 400.000.000đ`;
      } else {
        fee = 44000000 + (valueNum - 2000000000) * 0.001;
        formula = `Từ trên 2.000.000.000đ: 44.000.000đ + 0,1% của phần giá trị vượt 2.000.000.000đ`;
      }
    }

    const roundedFee = Math.floor(fee);
    return { courtFee: roundedFee, mediationFee: Math.floor(roundedFee * 0.5), formula };
  }, [disputeType, hasValue, monetaryValue]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val === '') {
      setMonetaryValue('');
      return;
    }
    const formatted = new Intl.NumberFormat('vi-VN').format(parseInt(val));
    setMonetaryValue(formatted);
  };

  const reset = () => {
    setMonetaryValue('');
    setHasValue(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F5F5F5] text-[#1A1A1A] font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-[#8B0000] via-[#B71C1C] to-[#8B0000] text-white shadow-md">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-4 sm:py-5 flex items-center gap-3 sm:gap-5">
          <img
            src="logo-vks.png"
            alt="Logo Viện kiểm sát nhân dân"
            className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain shrink-0 drop-shadow-lg"
          />
          <div className="min-w-0">
            <div className="text-[#FFD54F] text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-1">
              VKSND khu vực 3, tỉnh Quảng Trị
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight leading-tight">
              Tính Án Phí &amp; Hòa Giải
            </h1>
            <p className="text-white/80 text-[11px] sm:text-sm font-medium uppercase tracking-wider mt-1">
              Theo Nghị quyết 326/2016/UBTVQH14
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Input Section */}
          <section className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-100">
            <div className="space-y-7 sm:space-y-8">
              {/* Dispute Type Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">
                  Loại tranh chấp
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3">
                  {[
                    { id: 'CIVIL', label: 'Dân sự, Hôn nhân', icon: Scale },
                    { id: 'BUSINESS', label: 'Kinh doanh TM', icon: Briefcase },
                    { id: 'LABOR', label: 'Lao động', icon: Gavel },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setDisputeType(type.id as DisputeType)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        disputeType === type.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'
                      }`}
                    >
                      <type.icon size={20} className={`shrink-0 ${disputeType === type.id ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className="font-semibold text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Value Toggle */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">
                  Tính chất tranh chấp
                </label>
                <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-xl w-full sm:w-fit">
                  <button
                    onClick={() => setHasValue(false)}
                    className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      !hasValue ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Không giá ngạch
                  </button>
                  <button
                    onClick={() => setHasValue(true)}
                    className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      hasValue ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Có giá ngạch
                  </button>
                </div>
              </div>

              {/* Monetary Value Input */}
              <AnimatePresence mode="wait">
                {hasValue && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">
                      Giá trị tranh chấp (VNĐ)
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={monetaryValue}
                        onChange={handleValueChange}
                        placeholder="Nhập số tiền..."
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-5 pr-20 py-4 text-lg sm:text-xl font-bold focus:outline-none focus:border-blue-600 focus:bg-white transition-all group-hover:border-gray-200"
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                        VNĐ
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={reset}
                  className="flex items-center gap-2 text-gray-400 hover:text-gray-600 font-semibold text-sm transition-colors"
                >
                  <RefreshCw size={16} />
                  Làm mới
                </button>
              </div>
            </div>
          </section>

          {/* Right column: results + notes */}
          <div className="lg:col-span-7 grid gap-6 lg:gap-8">
            <AnimatePresence>
              {result ? (
                <motion.section
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Court Fee Card */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Scale size={80} />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 sm:mb-6">
                      Mức án phí sơ thẩm
                    </h3>
                    <div className="text-2xl sm:text-3xl font-black text-blue-600 mb-2 break-words">
                      {formatCurrency(result.courtFee)}
                    </div>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                      {result.formula}
                    </p>
                  </div>

                  {/* Mediation Fee Card */}
                  <div className="bg-blue-600 rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-200 relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Calculator size={80} />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-4 sm:mb-6">
                      Án phí hòa giải (50%)
                    </h3>
                    <div className="text-2xl sm:text-3xl font-black mb-2 break-words">
                      {formatCurrency(result.mediationFee)}
                    </div>
                    <p className="text-sm text-blue-100 font-medium leading-relaxed">
                      Trường hợp các đương sự thỏa thuận được với nhau trước khi mở phiên tòa.
                    </p>
                  </div>
                </motion.section>
              ) : (
                <motion.section
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex items-center gap-4 text-gray-500"
                >
                  <Calculator size={28} className="text-blue-600 shrink-0" />
                  <p className="text-sm font-medium">Nhập giá trị tranh chấp để xem mức án phí và án phí hòa giải.</p>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Info Section */}
            <section className="bg-gray-100/50 rounded-3xl p-5 sm:p-8 border border-dashed border-gray-200">
              <div className="flex gap-3 sm:gap-4">
                <div className="text-blue-600 mt-1">
                  <Info size={20} />
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900">Lưu ý quan trọng</h4>
                  <ul className="space-y-3 text-sm text-gray-600 font-medium">
                    <li className="flex items-start gap-2">
                      <ChevronRight size={16} className="mt-0.5 text-gray-400 shrink-0" />
                      <span>Kết quả chỉ mang tính chất tham khảo dựa trên Nghị quyết 326/2016/UBTVQH14.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight size={16} className="mt-0.5 text-gray-400 shrink-0" />
                      <span>Mức án phí thực tế có thể thay đổi tùy theo quyết định cụ thể của Tòa án và các tình tiết của vụ việc.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight size={16} className="mt-0.5 text-gray-400 shrink-0" />
                      <span>Đối với án phí hòa giải: Áp dụng khi Tòa án tiến hành hòa giải trước khi mở phiên tòa và các bên thỏa thuận được với nhau (Điều 26, Khoản 7).</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-4 sm:px-6 py-6 text-center border-t border-gray-200 bg-white">
        <p className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">
          VKSND khu vực 3, tỉnh Quảng Trị &middot; Công cụ hỗ trợ pháp lý
        </p>
      </footer>
    </div>
  );
}
