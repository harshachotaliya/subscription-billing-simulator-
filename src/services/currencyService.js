/**
 * Currency conversion service with exchange rates
 * Note: In production, you would fetch real-time rates from an API like exchangerate-api.com
 */

// Exchange rates relative to USD (as of example date)
// In production, these should be fetched from a real-time API
const EXCHANGE_RATES = {
    USD: 1.0,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.0,
    CAD: 1.25,
    AUD: 1.35,
    CHF: 0.92,
    CNY: 6.45,
    INR: 74.5,
    BRL: 5.2,
    MXN: 20.1,
    KRW: 1180.0,
    SGD: 1.35,
    HKD: 7.8,
    NOK: 8.5,
    SEK: 8.7,
    DKK: 6.3,
    PLN: 3.9,
    CZK: 21.5,
    HUF: 300.0,
    RUB: 73.5,
    ZAR: 14.8,
    TRY: 8.5,
    ILS: 3.2,
    AED: 3.67,
    SAR: 3.75,
    THB: 33.0,
    MYR: 4.2,
    IDR: 14300.0,
    PHP: 50.5,
    VND: 23000.0,
    NZD: 1.4,
    CLP: 800.0,
    COP: 3800.0,
    PEN: 3.6,
    ARS: 100.0,
    UYU: 43.0,
    BOB: 6.9,
    PYG: 7000.0,
    BGN: 1.66,
    RON: 4.2,
    HRK: 6.4,
    RSD: 100.0,
    MKD: 52.0,
    ALL: 104.0,
    ISK: 130.0,
    MDL: 17.8,
    UAH: 27.0,
    BYN: 2.5,
    KZT: 425.0,
    UZS: 10700.0,
    KGS: 84.5,
    TJS: 11.3,
    TMT: 3.5,
    AZN: 1.7,
    GEL: 3.1,
    AMD: 520.0,
    LBP: 1500.0,
    JOD: 0.71,
    KWD: 0.30,
    BHD: 0.38,
    QAR: 3.64,
    OMR: 0.38,
    YER: 250.0,
    AFN: 78.0,
    PKR: 160.0,
    LKR: 200.0,
    BDT: 85.0,
    NPR: 119.0,
    BTN: 74.5,
    MVR: 15.4,
    LKR: 200.0,
    MMK: 1770.0,
    KHR: 4100.0,
    LAK: 9500.0,
    MOP: 8.0,
    TWD: 28.0,
    MNT: 2850.0,
    KZT: 425.0,
    UZS: 10700.0,
    KGS: 84.5,
    TJS: 11.3,
    TMT: 3.5,
    AZN: 1.7,
    GEL: 3.1,
    AMD: 520.0,
    LBP: 1500.0,
    JOD: 0.71,
    KWD: 0.30,
    BHD: 0.38,
    QAR: 3.64,
    OMR: 0.38,
    YER: 250.0,
    AFN: 78.0,
    PKR: 160.0,
    LKR: 200.0,
    BDT: 85.0,
    NPR: 119.0,
    BTN: 74.5,
    MVR: 15.4,
    LKR: 200.0,
    MMK: 1770.0,
    KHR: 4100.0,
    LAK: 9500.0,
    MOP: 8.0,
    TWD: 28.0,
    MNT: 2850.0
};

// Supported currencies list
export const SUPPORTED_CURRENCIES = Object.keys(EXCHANGE_RATES);

/**
 * Convert amount from one currency to USD
 * @param {number} amount - The amount to convert
 * @param {string} fromCurrency - The source currency code
 * @returns {number} - The amount in USD
 */
export function convertToUSD(amount, fromCurrency) {
    if (!fromCurrency || !EXCHANGE_RATES[fromCurrency.toUpperCase()]) {
        throw new Error(`Unsupported currency: ${fromCurrency}`);
    }
    
    const rate = EXCHANGE_RATES[fromCurrency.toUpperCase()];
    return amount / rate;
}

/**
 * Convert amount from USD to another currency
 * @param {number} usdAmount - The amount in USD
 * @param {string} toCurrency - The target currency code
 * @returns {number} - The amount in target currency
 */
export function convertFromUSD(usdAmount, toCurrency) {
    if (!toCurrency || !EXCHANGE_RATES[toCurrency.toUpperCase()]) {
        throw new Error(`Unsupported currency: ${toCurrency}`);
    }
    
    const rate = EXCHANGE_RATES[toCurrency.toUpperCase()];
    return usdAmount * rate;
}

/**
 * Get exchange rate between two currencies
 * @param {string} fromCurrency - The source currency code
 * @param {string} toCurrency - The target currency code
 * @returns {number} - The exchange rate
 */
export function getExchangeRate(fromCurrency, toCurrency) {
    if (fromCurrency.toUpperCase() === toCurrency.toUpperCase()) {
        return 1.0;
    }
    
    const fromRate = EXCHANGE_RATES[fromCurrency.toUpperCase()];
    const toRate = EXCHANGE_RATES[toCurrency.toUpperCase()];
    
    if (!fromRate || !toRate) {
        throw new Error(`Unsupported currency: ${fromCurrency} or ${toCurrency}`);
    }
    
    return toRate / fromRate;
}

/**
 * Format currency amount with proper symbols and decimals
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount, currency) {
    const currencySymbols = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥',
        CAD: 'C$',
        AUD: 'A$',
        CHF: 'CHF',
        CNY: '¥',
        INR: '₹',
        BRL: 'R$',
        MXN: '$',
        KRW: '₩',
        SGD: 'S$',
        HKD: 'HK$',
        NOK: 'kr',
        SEK: 'kr',
        DKK: 'kr',
        PLN: 'zł',
        CZK: 'Kč',
        HUF: 'Ft',
        RUB: '₽',
        ZAR: 'R',
        TRY: '₺',
        ILS: '₪',
        AED: 'د.إ',
        SAR: '﷼',
        THB: '฿',
        MYR: 'RM',
        IDR: 'Rp',
        PHP: '₱',
        VND: '₫',
        NZD: 'NZ$',
        CLP: '$',
        COP: '$',
        PEN: 'S/',
        ARS: '$',
        UYU: '$U',
        BOB: 'Bs',
        PYG: '₲',
        BGN: 'лв',
        RON: 'lei',
        HRK: 'kn',
        RSD: 'дин',
        MKD: 'ден',
        ALL: 'L',
        ISK: 'kr',
        MDL: 'L',
        UAH: '₴',
        BYN: 'Br',
        KZT: '₸',
        UZS: 'лв',
        KGS: 'лв',
        TJS: 'SM',
        TMT: 'T',
        AZN: '₼',
        GEL: '₾',
        AMD: '֏',
        LBP: 'ل.ل',
        JOD: 'د.ا',
        KWD: 'د.ك',
        BHD: 'د.ب',
        QAR: 'ر.ق',
        OMR: 'ر.ع.',
        YER: '﷼',
        AFN: '؋',
        PKR: '₨',
        LKR: '₨',
        BDT: '৳',
        NPR: '₨',
        BTN: 'Nu.',
        MVR: '.ރ',
        MMK: 'K',
        KHR: '៛',
        LAK: '₭',
        MOP: 'MOP$',
        TWD: 'NT$',
        MNT: '₮'
    };
    
    const symbol = currencySymbols[currency.toUpperCase()] || currency.toUpperCase();
    const decimals = ['JPY', 'KRW', 'VND', 'IDR', 'UZS', 'KHR', 'LAK', 'MMK', 'MNT'].includes(currency.toUpperCase()) ? 0 : 2;
    
    return `${symbol}${amount.toFixed(decimals)}`;
}

/**
 * Validate if a currency is supported
 * @param {string} currency - The currency code to validate
 * @returns {boolean} - True if supported, false otherwise
 */
export function isCurrencySupported(currency) {
    return EXCHANGE_RATES.hasOwnProperty(currency.toUpperCase());
}

/**
 * Get all supported currencies
 * @returns {string[]} - Array of supported currency codes
 */
export function getSupportedCurrencies() {
    return SUPPORTED_CURRENCIES;
}
