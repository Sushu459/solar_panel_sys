import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Zap, IndianRupee, TrendingUp, Leaf, Info, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { useData } from '../contexts/DataContext';
import Header from '../sections/public/Header';
import Footer from '../sections/public/Footer';
import type { CalculatorResults } from '../types';

export default function CalculatorPage() {
  const { settings, fetchSettings } = useData();
  const [useKwh, setUseKwh] = useState(false);
  const [monthlyBill, setMonthlyBill] = useState<string>('');
  const [monthlyKwh, setMonthlyKwh] = useState<string>('');
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [results, setResults] = useState<CalculatorResults | null>(null);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const calculateSavings = () => {
    if (!settings) return;

    const inputValue = useKwh
      ? parseFloat(monthlyKwh) || 0
      : parseFloat(monthlyBill) || 0;

    if (inputValue <= 0) return;

    const currentMonthlyKwh = useKwh
      ? inputValue
      : inputValue / settings.tariff_per_kwh;

    const currentMonthlyCost = useKwh
      ? inputValue * settings.tariff_per_kwh
      : inputValue;

    const recommendedSystemSize = Math.ceil(
      currentMonthlyKwh / settings.kwh_per_kw_per_month
    );

    const systemCost = recommendedSystemSize * settings.system_cost_per_kw;
    const subsidyAmount = systemCost * (settings.subsidy_percentage / 100);
    const netCost = systemCost - subsidyAmount;
    const monthlyGeneration = recommendedSystemSize * settings.kwh_per_kw_per_month;
    const monthlySavings = monthlyGeneration * settings.tariff_per_kwh;
    const yearlySavings = monthlySavings * 12;
    const savingsPercentage = (monthlySavings / currentMonthlyCost) * 100;
    const paybackPeriod = netCost / yearlySavings;
    const maintenanceCostTotal = recommendedSystemSize * settings.maintenance_cost_per_kw_year * 25;
    const twentyFiveYearSavings = yearlySavings * 25 - netCost - maintenanceCostTotal;
    const co2Reduction = monthlyGeneration * 12 * 25 * 0.85; // kg over 25 years

    setResults({
      currentMonthlyCost,
      recommendedSystemSize,
      systemCost,
      subsidyAmount,
      netCost,
      monthlyGeneration,
      monthlySavings,
      yearlySavings,
      savingsPercentage: Math.min(savingsPercentage, 100),
      paybackPeriod,
      twentyFiveYearSavings,
      co2Reduction,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number, decimals = 0) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: decimals,
    }).format(value);
  };

  const inputClasses = "pl-12 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 shadow-sm rounded-xl py-6 text-lg font-medium";

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-white text-slate-800 selection:bg-lime-200">
      <Header />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-100 border border-emerald-200 mb-6 shadow-sm">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Savings Calculator</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
              Switch to Solar, <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-500">Save Every Month</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Discover your potential savings in seconds. Enter your current energy usage and see the impact of clean solar power on your pocket and the planet.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Input Section */}
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-lime-100 shadow-xl shadow-emerald-900/5">
              <h2 className="text-2xl font-extrabold text-slate-800 mb-8">Tell us your usage</h2>

              {/* Toggle Switch */}
              <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 mb-8">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${!useKwh ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-300'} transition-all`}>
                    <IndianRupee className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-bold ${!useKwh ? 'text-slate-800' : 'text-slate-400'}`}>Monthly Bill</span>
                </div>
                
                <Switch
                  checked={useKwh}
                  onCheckedChange={setUseKwh}
                  className="data-[state=unchecked]:bg-emerald-200 data-[state=checked]:bg-emerald-500 border-emerald-300/60 shadow-sm [&_[data-slot=switch-thumb]]:bg-white"
                />
                
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${useKwh ? 'text-slate-800' : 'text-slate-400'}`}>Monthly kWh</span>
                  <div className={`p-2 rounded-lg ${useKwh ? 'bg-lime-100 text-lime-600' : 'bg-white text-slate-300'} transition-all`}>
                    <Zap className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Input Field */}
              <div className="space-y-3 mb-8">
                <Label className="text-slate-700 font-bold ml-1">
                  {useKwh ? 'Average Usage (kWh)' : 'Average Monthly Bill (₹)'}
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {useKwh ? <Zap className="w-5 h-5" /> : <IndianRupee className="w-5 h-5" />}
                  </div>
                  <Input
                    type="number"
                    placeholder={useKwh ? 'e.g., 500' : 'e.g., 5000'}
                    value={useKwh ? monthlyKwh : monthlyBill}
                    onChange={(e) => useKwh ? setMonthlyKwh(e.target.value) : setMonthlyBill(e.target.value)}
                    className={inputClasses}
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    {useKwh ? 'kWh' : '/ month'}
                  </div>
                </div>
              </div>

              <Button
                onClick={calculateSavings}
                disabled={useKwh ? !monthlyKwh || parseFloat(monthlyKwh) <= 0 : !monthlyBill || parseFloat(monthlyBill) <= 0}
                className="w-full bg-gradient-to-r from-emerald-500 to-lime-500 text-white hover:from-emerald-600 hover:to-lime-600 py-8 text-lg font-extrabold rounded-2xl shadow-lg shadow-emerald-500/20 border-0 transition-transform hover:-translate-y-0.5"
              >
                <Calculator className="w-6 h-6 mr-2" />
                Analyze Savings
              </Button>

              {/* Assumptions Toggle */}
              <button
                onClick={() => setShowAssumptions(!showAssumptions)}
                className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 mt-8 text-sm font-bold transition-colors mx-auto"
              >
                <Info className="w-4 h-4" />
                How we calculate this
                {showAssumptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAssumptions && settings && (
                <div className="mt-6 p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 text-sm animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Grid Tariff</span>
                    <span className="text-slate-800 font-bold">₹{settings.tariff_per_kwh}/kWh</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Gen per kW</span>
                    <span className="text-slate-800 font-bold">{settings.kwh_per_kw_per_month} kWh/m</span>
                  </div>
                  <div className="flex justify-between font-medium text-emerald-600">
                    <span className="text-slate-500">Subsidy</span>
                    <span className="font-extrabold">{settings.subsidy_percentage}% Applicable</span>
                  </div>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="lg:sticky lg:top-32">
              {results ? (
                <div className="space-y-6 animate-in zoom-in-95 duration-500">
                  {/* Main Savings Card */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <TrendingUp className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-emerald-400 font-extrabold uppercase tracking-widest text-xs mb-2">Estimated Annual Savings</h3>
                      <div className="text-5xl sm:text-6xl font-extrabold text-white mb-4 tracking-tight">
                        {formatCurrency(results.yearlySavings)}
                      </div>
                      <div className="text-slate-300 font-medium text-lg">
                        Reducing your bill by <span className="text-emerald-400 font-bold">{formatNumber(results.savingsPercentage)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-[2rem] p-6 border border-lime-100 shadow-sm">
                      <div className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-1">Recommended Size</div>
                      <div className="text-2xl font-extrabold text-slate-800">{formatNumber(results.recommendedSystemSize)} kW</div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-lime-100 shadow-sm">
                      <div className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-1">Payback Period</div>
                      <div className="text-2xl font-extrabold text-slate-800">{formatNumber(results.paybackPeriod, 1)} Years</div>
                    </div>
                  </div>

                  {/* Environmental Impact */}
                  <div className="bg-emerald-50 rounded-[2rem] p-8 border border-emerald-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center border border-emerald-200">
                        <Leaf className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-extrabold text-emerald-900">Green Impact</h3>
                    </div>
                    <p className="text-emerald-800/70 font-medium mb-3">Your system will offset approx.</p>
                    <div className="text-4xl font-extrabold text-emerald-600 leading-none mb-1">
                      {formatNumber(results.co2Reduction / 1000, 1)} Tonnes
                    </div>
                    <p className="text-emerald-800/70 font-bold text-sm">of CO₂ over 25 years</p>
                  </div>

                  {/* CTA */}
                  <Link to="/contact">
                    <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 py-8 text-lg font-bold rounded-2xl shadow-xl transition-all hover:-translate-y-1">
                      Get Expert Consultation
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-[2.5rem] p-10 border-2 border-lime-100 border-dashed text-center">
                  <div className="w-20 h-20 rounded-full bg-lime-50 flex items-center justify-center mb-6">
                    <TrendingUp className="w-10 h-10 text-lime-200" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800 mb-2">See your potential</h3>
                  <p className="text-slate-500 font-medium max-w-xs">
                    Fill in your electricity details to see how much you can save by going solar.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}