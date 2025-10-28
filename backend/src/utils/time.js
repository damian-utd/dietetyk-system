export function localNow() {
    return new Date().toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' });
}
