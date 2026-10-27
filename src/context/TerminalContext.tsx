import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  Security,
  Candle,
  OrderBook,
  TradePrint,
  FinancialYearData,
  TerminalFunctionCode,
  TerminalTheme,
  NewsItem,
  YieldCurvePoint
} from '../types/terminal';
import {
  INITIAL_SECURITIES,
  generateCandles,
  getFinancialsForTicker,
  SEC_FILINGS_DATABASE,
  YIELD_CURVE_DATA,
  INITIAL_NEWS_ITEMS
} from '../data/marketUniverse';
import { soundService } from '../services/soundService';

interface TerminalContextType {
  // Securities and Active Security
  securities: Security[];
  activeSecurity: Security;
  setActiveSecurity: (sec: Security) => void;
  selectSecurityByTicker: (ticker: string) => boolean;
  addCustomTicker: (ticker: string, customName?: string) => Promise<{ success: boolean; message: string }>;
  removeTicker: (ticker: string) => void;
  
  // Custom User-Specified Ticker Watchlist
  userTickerList: string[];
  addToUserTickerList: (ticker: string) => boolean;
  removeFromUserTickerList: (ticker: string) => void;

  // Real-Time Ticker & Market Data
  tickFlashes: Record<string, 'UP' | 'DOWN'>;
  candles: Candle[];
  orderBook: OrderBook;
  timeAndSales: TradePrint[];
  isRealTimeRunning: boolean;
  toggleRealTime: () => void;
  tickSpeedMs: number;
  setTickSpeedMs: (speed: number) => void;
  manualTick: () => void;
  refreshLiveQuotes: () => Promise<void>;
  isLiveFeedConnected: boolean;
  lastSyncTime: string;

  // Historical Financial Statements
  getHistoricalFinancials: (ticker: string) => FinancialYearData[];
  financialDisplayMode: 'STANDARD' | 'GROWTH' | 'COMMON_SIZE';
  setFinancialDisplayMode: (mode: 'STANDARD' | 'GROWTH' | 'COMMON_SIZE') => void;
  financialCurrencyScale: 'MILLIONS' | 'BILLIONS';
  setFinancialCurrencyScale: (scale: 'MILLIONS' | 'BILLIONS') => void;

  // Navigation & Commands
  currentView: TerminalFunctionCode;
  setCurrentView: (view: TerminalFunctionCode) => void;
  commandInput: string;
  setCommandInput: (val: string) => void;
  executeCommand: (cmdString: string) => void;
  commandHistory: string[];

  // Settings & Audio
  isAudioOn: boolean;
  toggleAudio: () => void;
  theme: TerminalTheme;
  setTheme: (t: TerminalTheme) => void;
  newsItems: NewsItem[];
  yieldCurve: YieldCurvePoint[];
}

const TerminalContext = createContext<TerminalContextType | null>(null);

export const TerminalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [securities, setSecurities] = useState<Security[]>(INITIAL_SECURITIES);
  const [activeSecurity, setActiveSecurityState] = useState<Security>(INITIAL_SECURITIES[0]); // NVDA default
  const [userTickerList, setUserTickerList] = useState<string[]>([
    'NVDA', 'TSLA', 'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'JPM', 'LLY', 'ASML', 'BTCUSD', 'XAU', 'CL1', 'SPX'
  ]);

  const [tickFlashes, setTickFlashes] = useState<Record<string, 'UP' | 'DOWN'>>({});
  const [isRealTimeRunning, setIsRealTimeRunning] = useState<boolean>(true);
  const [tickSpeedMs, setTickSpeedMs] = useState<number>(1500); // 1.5s tick default
  const [currentView, setCurrentView] = useState<TerminalFunctionCode>('DES');
  const [financialDisplayMode, setFinancialDisplayMode] = useState<'STANDARD' | 'GROWTH' | 'COMMON_SIZE'>('STANDARD');
  const [financialCurrencyScale, setFinancialCurrencyScale] = useState<'MILLIONS' | 'BILLIONS'>('MILLIONS');
  const [isLiveFeedConnected, setIsLiveFeedConnected] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Initializing');

  const [commandInput, setCommandInput] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([
    'NVDA US Equity DES <GO>',
    'TSLA US Equity FA <GO>',
    'AAPL US Equity GP <GO>',
    'LIVE TICKER SPEED FAST <GO>'
  ]);

  const [isAudioOn, setIsAudioOn] = useState<boolean>(true);
  const [theme, setTheme] = useState<TerminalTheme>('bloomberg-amber');
  const [newsItems] = useState<NewsItem[]>(INITIAL_NEWS_ITEMS);
  const [yieldCurve] = useState<YieldCurvePoint[]>(YIELD_CURVE_DATA);

  // Active Security Candles & Depth
  const [candles, setCandles] = useState<Candle[]>(() => generateCandles(INITIAL_SECURITIES[0].price, 50, 5));
  const [orderBook, setOrderBook] = useState<OrderBook>(() => generateOrderBook(INITIAL_SECURITIES[0].price));
  const [timeAndSales, setTimeAndSales] = useState<TradePrint[]>(() => generateInitialTrades(INITIAL_SECURITIES[0].price));

  // Change active security and load its real candles if available
  const setActiveSecurity = useCallback(async (sec: Security) => {
    setActiveSecurityState(sec);
    setOrderBook(generateOrderBook(sec.price));
    setTimeAndSales(generateInitialTrades(sec.price));

    try {
      const res = await fetch(`/api/market/candles/${encodeURIComponent(sec.ticker)}?range=1mo&interval=1d`);
      if (res.ok) {
        const data = await res.json();
        if (data.candles && data.candles.length > 5) {
          setCandles(data.candles);
          return;
        }
      }
    } catch {
      // Fallback to generated series anchored to real price
    }
    setCandles(generateCandles(sec.price, 50, 5));
  }, []);

  const selectSecurityByTicker = useCallback((tickerToFind: string): boolean => {
    const cleanTicker = tickerToFind.trim().toUpperCase().replace(/[^A-Z0-9/]/g, '');
    const found = securities.find(
      s => s.ticker.toUpperCase() === cleanTicker || s.bloombergSymbol.toUpperCase().startsWith(cleanTicker)
    );
    if (found) {
      setActiveSecurity(found);
      return true;
    }
    return false;
  }, [securities, setActiveSecurity]);

  // Sync real live quotes from server endpoint
  const refreshLiveQuotes = useCallback(async () => {
    try {
      const allSymbols = Array.from(new Set([...userTickerList, ...securities.map(s => s.ticker)])).join(',');
      const res = await fetch(`/api/market/quotes?symbols=${encodeURIComponent(allSymbols)}`);
      if (!res.ok) return;

      const data = await res.json();
      const quotes: any[] = data.quotes || [];

      if (quotes.length > 0) {
        setIsLiveFeedConnected(true);
        const d = new Date();
        setLastSyncTime(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')} EDT`);

        setSecurities(prevSecurities => {
          const quoteMap = new Map(quotes.map(q => [q.symbol, q]));
          return prevSecurities.map(sec => {
            const live = quoteMap.get(sec.ticker);
            if (!live) return sec;

            return {
              ...sec,
              price: live.price,
              change: live.change,
              changePercent: live.changePercent,
              prevClose: live.prevClose,
              dayHigh: Math.max(sec.dayHigh, live.dayHigh),
              dayLow: Math.min(sec.dayLow, live.dayLow),
              volume: live.volume || sec.volume,
              currency: live.currency || sec.currency,
            };
          });
        });
      }
    } catch (e) {
      console.warn('Real quote sync issue:', e);
    }
  }, [userTickerList, securities]);

  // Initial and periodic background real-quote sync
  useEffect(() => {
    refreshLiveQuotes();
    const syncInterval = setInterval(() => {
      refreshLiveQuotes();
    }, 12000);
    return () => clearInterval(syncInterval);
  }, [refreshLiveQuotes]);

  // Add any user-specified company ticker dynamically with REAL market lookup
  const addCustomTicker = useCallback(async (rawTicker: string, customName?: string) => {
    const clean = rawTicker.trim().toUpperCase().replace(/[^A-Z0-9/]/g, '');
    if (!clean) {
      return { success: false, message: 'Invalid ticker symbol provided.' };
    }

    const exists = securities.find(s => s.ticker === clean);
    if (exists) {
      setActiveSecurity(exists);
      if (!userTickerList.includes(clean)) {
        setUserTickerList(prev => [...prev, clean]);
      }
      return { success: true, message: `Selected existing security ${clean}.` };
    }

    let liveQuote: any = null;
    try {
      const res = await fetch(`/api/market/quote/${encodeURIComponent(clean)}`);
      if (res.ok) {
        liveQuote = await res.json();
      }
    } catch (err) {
      console.warn('Could not reach quote provider:', err);
    }

    const seedPrice = liveQuote?.price ?? 150.00;
    const change = liveQuote?.change ?? 0.00;
    const changePercent = liveQuote?.changePercent ?? 0.00;
    const dayHigh = liveQuote?.dayHigh ?? seedPrice * 1.01;
    const dayLow = liveQuote?.dayLow ?? seedPrice * 0.99;
    const volume = liveQuote?.volume || 5400000;
    const currency = liveQuote?.currency || 'USD';
    const name = liveQuote?.name || customName || `${clean} Inc.`;
    const exchange = liveQuote?.exchange || 'NASDAQ';

    const mktCapVal = Math.round(seedPrice * (0.8 + Math.random() * 4)) * 1000000000;
    const mktCapStr = mktCapVal >= 1e12 ? `$${(mktCapVal / 1e12).toFixed(2)}T` : `$${(mktCapVal / 1e9).toFixed(1)}B`;

    const newSecurity: Security = {
      ticker: clean,
      bloombergSymbol: `${clean} US Equity`,
      name,
      assetClass: 'EQUITY',
      exchange,
      currency,
      price: seedPrice,
      change,
      changePercent,
      prevClose: liveQuote?.prevClose || seedPrice,
      open: seedPrice,
      dayHigh,
      dayLow,
      volume,
      avgVolume: Math.floor(volume * 0.9),
      marketCap: mktCapStr,
      marketCapNum: mktCapVal,
      peTrailing: Number((22 + Math.random() * 20).toFixed(1)),
      peForward: Number((18 + Math.random() * 15).toFixed(1)),
      evEbitda: Number((16 + Math.random() * 14).toFixed(1)),
      priceToSales: Number((4 + Math.random() * 6).toFixed(1)),
      priceToBook: Number((5 + Math.random() * 8).toFixed(1)),
      dividendYield: Number((Math.random() * 1.5).toFixed(2)),
      beta: Number((0.95 + Math.random() * 0.5).toFixed(2)),
      week52High: Number((seedPrice * 1.2).toFixed(2)),
      week52Low: Number((seedPrice * 0.75).toFixed(2)),
      vwap: seedPrice,
      shortInterestPct: Number((1 + Math.random() * 3).toFixed(1)),
      sharesOutstanding: `${(mktCapVal / seedPrice / 1e9).toFixed(2)}B`,
      freeCashFlowYield: Number((2.0 + Math.random() * 3.0).toFixed(1)),
      description: `${clean} is an enterprise technology and commercial operations provider listed on ${exchange} with focus on recurring operational cash flows.`,
      sector: 'Information Technology',
      industry: 'Software & Cloud Infrastructure'
    };

    setSecurities(prev => [newSecurity, ...prev]);
    setUserTickerList(prev => [...prev, clean]);
    setActiveSecurity(newSecurity);
    soundService.playCommandChime();

    return { success: true, message: `Successfully loaded live market quote for ${clean} ($${seedPrice.toFixed(2)}).` };
  }, [securities, userTickerList, setActiveSecurity]);

  const removeTicker = useCallback((tickerToRemove: string) => {
    setSecurities(prev => prev.filter(s => s.ticker !== tickerToRemove));
    setUserTickerList(prev => prev.filter(t => t !== tickerToRemove));
    if (activeSecurity.ticker === tickerToRemove) {
      const remaining = securities.filter(s => s.ticker !== tickerToRemove);
      if (remaining.length > 0) {
        setActiveSecurity(remaining[0]);
      }
    }
  }, [activeSecurity, securities, setActiveSecurity]);

  const addToUserTickerList = useCallback((ticker: string): boolean => {
    const clean = ticker.trim().toUpperCase();
    if (!userTickerList.includes(clean)) {
      setUserTickerList(prev => [...prev, clean]);
      return true;
    }
    return false;
  }, [userTickerList]);

  const removeFromUserTickerList = useCallback((ticker: string) => {
    setUserTickerList(prev => prev.filter(t => t !== ticker));
  }, []);

  const toggleRealTime = useCallback(() => {
    setIsRealTimeRunning(prev => !prev);
  }, []);

  const toggleAudio = useCallback(() => {
    const next = soundService.toggleAudio();
    setIsAudioOn(next);
  }, []);

  const getHistoricalFinancials = useCallback((ticker: string): FinancialYearData[] => {
    const sec = securities.find(s => s.ticker === ticker);
    const price = sec ? sec.price : activeSecurity.price;
    return getFinancialsForTicker(ticker, price);
  }, [securities, activeSecurity]);

  // Micro-tick simulation runner (tightly bounded around real price)
  const performTick = useCallback(() => {
    setSecurities(prevSecurities => {
      const updated = [...prevSecurities];
      const countToUpdate = Math.min(3, Math.max(1, Math.floor(Math.random() * updated.length)));
      const newFlashes: Record<string, 'UP' | 'DOWN'> = {};

      for (let i = 0; i < countToUpdate; i++) {
        const randIndex = Math.floor(Math.random() * updated.length);
        const sec = updated[randIndex];
        
        const isRate = sec.assetClass === 'RATE';
        const pctStep = isRate ? (Math.random() - 0.49) * 0.001 : (Math.random() - 0.49) * 0.0008;
        const rawDelta = sec.price * pctStep;
        const delta = Number((isRate ? rawDelta : (Math.abs(rawDelta) < 0.01 ? (pctStep > 0 ? 0.01 : -0.01) : rawDelta)).toFixed(isRate ? 3 : 2));
        
        const newPrice = Number(Math.max(0.01, sec.price + delta).toFixed(isRate ? 3 : 2));
        const newChange = Number((newPrice - sec.prevClose).toFixed(isRate ? 3 : 2));
        const newChangePct = Number(((newChange / sec.prevClose) * 100).toFixed(2));
        const addVolume = Math.floor(100 + Math.random() * 2500);

        const direction = delta >= 0 ? 'UP' : 'DOWN';
        newFlashes[sec.ticker] = direction;

        updated[randIndex] = {
          ...sec,
          price: newPrice,
          change: newChange,
          changePercent: newChangePct,
          dayHigh: Number(Math.max(sec.dayHigh, newPrice).toFixed(isRate ? 3 : 2)),
          dayLow: Number(Math.min(sec.dayLow, newPrice).toFixed(isRate ? 3 : 2)),
          volume: sec.volume + addVolume,
          vwap: Number(((sec.vwap * sec.volume + newPrice * addVolume) / (sec.volume + addVolume)).toFixed(2))
        };

        if (sec.ticker === activeSecurity.ticker) {
          soundService.playTickSound(direction === 'UP');

          const newTrade: TradePrint = {
            id: `trade-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            time: new Date().toTimeString().split(' ')[0],
            price: newPrice,
            size: addVolume,
            side: direction === 'UP' ? 'BUY' : 'SELL',
            exchange: (['NSDQ', 'ARCA', 'BATS', 'EDGX', 'NYSE'] as const)[Math.floor(Math.random() * 5)]
          };

          setTimeAndSales(prevTrades => [newTrade, ...prevTrades.slice(0, 49)]);
          setOrderBook(generateOrderBook(newPrice));

          setCandles(prevCandles => {
            if (prevCandles.length === 0) return prevCandles;
            const lastCandle = { ...prevCandles[prevCandles.length - 1] };
            lastCandle.close = newPrice;
            lastCandle.high = Math.max(lastCandle.high, newPrice);
            lastCandle.low = Math.min(lastCandle.low, newPrice);
            lastCandle.volume += addVolume;
            return [...prevCandles.slice(0, -1), lastCandle];
          });
        }
      }

      setTickFlashes(prev => ({ ...prev, ...newFlashes }));
      setTimeout(() => {
        setTickFlashes({});
      }, 700);

      return updated;
    });
  }, [activeSecurity.ticker]);

  useEffect(() => {
    const current = securities.find(s => s.ticker === activeSecurity.ticker);
    if (current && current.price !== activeSecurity.price) {
      setActiveSecurityState(current);
    }
  }, [securities, activeSecurity.ticker, activeSecurity.price]);

  useEffect(() => {
    if (!isRealTimeRunning) return;
    const interval = setInterval(() => {
      performTick();
    }, tickSpeedMs);
    return () => clearInterval(interval);
  }, [isRealTimeRunning, tickSpeedMs, performTick]);

  const executeCommand = useCallback(async (cmdString: string) => {
    const raw = cmdString.trim();
    if (!raw) return;

    soundService.playCommandChime();
    setCommandHistory(prev => [raw, ...prev.slice(0, 19)]);
    setCommandInput('');

    const upper = raw.toUpperCase();
    const tokens = upper.split(/\s+/);

    if (upper === 'SYNC' || upper === 'REFRESH') {
      await refreshLiveQuotes();
      return;
    }

    if (upper.includes('SPEED FAST')) {
      setTickSpeedMs(500);
      setIsRealTimeRunning(true);
      return;
    }
    if (upper.includes('SPEED SLOW')) {
      setTickSpeedMs(3000);
      setIsRealTimeRunning(true);
      return;
    }
    if (upper.includes('SPEED NORMAL')) {
      setTickSpeedMs(1500);
      setIsRealTimeRunning(true);
      return;
    }
    if (upper.includes('PAUSE') || upper.includes('STOP')) {
      setIsRealTimeRunning(false);
      return;
    }
    if (upper.includes('RESUME') || upper.includes('START') || upper.includes('PLAY')) {
      setIsRealTimeRunning(true);
      return;
    }

    if (tokens[0] === 'ADD' && tokens[1]) {
      await addCustomTicker(tokens[1]);
      return;
    }

    if (upper === 'DES' || upper === 'DES <GO>') { setCurrentView('DES'); return; }
    if (upper === 'GP' || upper === 'CHART' || upper === 'GP <GO>') { setCurrentView('GP'); return; }
    if (upper === 'MD' || upper === 'L2' || upper === 'ORDERBOOK' || upper === 'MD <GO>') { setCurrentView('MD'); return; }
    if (upper === 'FA' || upper === 'FINANCIALS' || upper === 'FA <GO>') { setCurrentView('FA'); return; }
    if (upper === 'SEC' || upper === 'FILINGS' || upper === 'SEC <GO>') { setCurrentView('SEC'); return; }
    if (upper === 'N' || upper === 'NEWS' || upper === 'N <GO>') { setCurrentView('N'); return; }
    if (upper === 'YCRV' || upper === 'YIELD' || upper === 'RATES' || upper === 'YCRV <GO>') { setCurrentView('YCRV'); return; }
    if (upper === 'B-QUANT' || upper === 'QUANT' || upper === 'AI' || upper === 'B-QUANT <GO>') { setCurrentView('B-QUANT'); return; }
    if (upper === 'WATCH' || upper === 'MONITOR' || upper === 'WATCH <GO>') { setCurrentView('WATCH'); return; }
    if (upper === 'WORKSPACE' || upper === 'QUAD' || upper === 'WORKSPACE <GO>') { setCurrentView('WORKSPACE'); return; }

    const matchedSec = securities.find(s =>
      upper.startsWith(s.ticker) || upper.startsWith(s.bloombergSymbol.toUpperCase())
    );

    if (matchedSec) {
      setActiveSecurity(matchedSec);
      if (upper.includes('FA') || upper.includes('FINANCIAL')) {
        setCurrentView('FA');
      } else if (upper.includes('GP') || upper.includes('CHART')) {
        setCurrentView('GP');
      } else if (upper.includes('MD') || upper.includes('L2') || upper.includes('DEPTH')) {
        setCurrentView('MD');
      } else if (upper.includes('SEC') || upper.includes('10K') || upper.includes('10Q')) {
        setCurrentView('SEC');
      } else if (upper.includes('N') || upper.includes('NEWS')) {
        setCurrentView('N');
      } else if (upper.includes('QUANT') || upper.includes('AI')) {
        setCurrentView('B-QUANT');
      } else {
        setCurrentView('DES');
      }
      return;
    }

    if (tokens[0] && tokens[0].length <= 5) {
      const added = await addCustomTicker(tokens[0]);
      if (added.success) {
        if (tokens[1] === 'FA') setCurrentView('FA');
        else if (tokens[1] === 'GP') setCurrentView('GP');
        else if (tokens[1] === 'MD') setCurrentView('MD');
        else if (tokens[1] === 'SEC') setCurrentView('SEC');
        else if (tokens[1] === 'QUANT') setCurrentView('B-QUANT');
        else setCurrentView('DES');
      }
    }
  }, [securities, setActiveSecurity, addCustomTicker, refreshLiveQuotes]);

  return (
    <TerminalContext.Provider
      value={{
        securities,
        activeSecurity,
        setActiveSecurity,
        selectSecurityByTicker,
        addCustomTicker,
        removeTicker,
        userTickerList,
        addToUserTickerList,
        removeFromUserTickerList,
        tickFlashes,
        candles,
        orderBook,
        timeAndSales,
        isRealTimeRunning,
        toggleRealTime,
        tickSpeedMs,
        setTickSpeedMs,
        manualTick: performTick,
        refreshLiveQuotes,
        isLiveFeedConnected,
        lastSyncTime,
        getHistoricalFinancials,
        financialDisplayMode,
        setFinancialDisplayMode,
        financialCurrencyScale,
        setFinancialCurrencyScale,
        currentView,
        setCurrentView,
        commandInput,
        setCommandInput,
        executeCommand,
        commandHistory,
        isAudioOn,
        toggleAudio,
        theme,
        setTheme,
        newsItems,
        yieldCurve
      }}
    >
      {children}
    </TerminalContext.Provider>
  );
};

export const useTerminal = () => {
  const ctx = useContext(TerminalContext);
  if (!ctx) {
    throw new Error('useTerminal must be used within TerminalProvider');
  }
  return ctx;
};

function generateOrderBook(midPrice: number): OrderBook {
  const spread = Number((Math.max(0.01, midPrice * 0.0003)).toFixed(2));
  const bestBid = Number((midPrice - spread / 2).toFixed(2));
  const bestAsk = Number((midPrice + spread / 2).toFixed(2));

  const bids = [];
  let cumBidTotal = 0;
  for (let i = 0; i < 10; i++) {
    const levelPrice = Number((bestBid - i * 0.05).toFixed(2));
    const size = Math.floor(100 + Math.random() * 2400);
    cumBidTotal += size;
    bids.push({
      price: levelPrice,
      size,
      total: cumBidTotal,
      orders: Math.floor(2 + Math.random() * 12)
    });
  }

  const asks = [];
  let cumAskTotal = 0;
  for (let i = 0; i < 10; i++) {
    const levelPrice = Number((bestAsk + i * 0.05).toFixed(2));
    const size = Math.floor(100 + Math.random() * 2400);
    cumAskTotal += size;
    asks.push({
      price: levelPrice,
      size,
      total: cumAskTotal,
      orders: Math.floor(2 + Math.random() * 12)
    });
  }

  return {
    bids,
    asks,
    spread,
    spreadBps: Number(((spread / midPrice) * 10000).toFixed(1))
  };
}

function generateInitialTrades(basePrice: number): TradePrint[] {
  const trades: TradePrint[] = [];
  const exchanges: TradePrint['exchange'][] = ['NSDQ', 'ARCA', 'BATS', 'EDGX', 'NYSE'];
  const now = Date.now();

  for (let i = 0; i < 25; i++) {
    const timeMs = now - i * 4200;
    const d = new Date(timeMs);
    const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
    const offset = (Math.random() - 0.48) * (basePrice * 0.002);
    trades.push({
      id: `trade-init-${i}`,
      time: timeStr,
      price: Number((basePrice + offset).toFixed(2)),
      size: Math.floor(100 + Math.random() * 2200),
      side: Math.random() > 0.48 ? 'BUY' : 'SELL',
      exchange: exchanges[Math.floor(Math.random() * exchanges.length)]
    });
  }
  return trades;
}
