const GAUSS_M = 24;
const GAUSS_N = 5;

export type State =
  | "BW" // Baden-Württemberg
  | "BY" // Bayern
  | "BE" // Berlin
  | "BB" // Brandenburg
  | "HB" // Bremen
  | "HE" // Hessen
  | "HH" // Hamburg
  | "MV" // Mecklenburg-Vorpommern
  | "NI" // Niedersachsen
  | "NW" // Nordrhein-Westfalen
  | "RP" // Rheinland-Pfalz
  | "SL" // Saarland
  | "SN" // Sachsen
  | "ST" // Sachsen-Anhalt
  | "SH" // Schleswig-Holstein
  | "TH"; // Thüringen

export const isHoliday = (date: Date, state?: State): boolean => {
  const year = date.getUTCFullYear();
  const easter = gaussEasterFormular(year);

  // primary source:    https://www.feiertage.net/bundeslaender.php
  // secondary source:  https://de.wikipedia.org/wiki/Gesetzliche_Feiertage_in_Deutschland
  const holidays = [
    new Date(year, 0, 1), // Neujahr
    new Date(year, easter.getUTCMonth(), easter.getDate() - 2), // Karfreitag
    new Date(year, easter.getUTCMonth(), easter.getDate() + 1), // Ostermontag
    new Date(year, 4, 1), // Erster Mai
    new Date(year, easter.getUTCMonth(), easter.getDate() + 39), // Christi Himmelfahrt
    new Date(year, easter.getUTCMonth(), easter.getDate() + 50), // Pfingstmontag
    new Date(year, 9, 3), // Tag der dt. Einheit
    new Date(year, 11, 25), // Erster Weihnachtstag
    new Date(year, 11, 26), // Zweiter Weihnachtstag
  ];

  if (state) {
    /*
     In der Stadt Augsburg ist außerdem der 8. August (Friedensfest) gesetzlicher Feiertag.

     *   : Fronleichnam ist gesetzlicher Feiertag nur in den vom Staatsministerium des Inneren durch Rechtsverordnung bestimmten Gemeinden im Landkreis Bautzen und im Westlausitzkreis.
     **  : Der Innenminister kann durch Rechtsverordnung für Gemeinden mit überwiegend katholischer Bevölkerung Fronleichnam als gesetzlichen Feiertag festlegen. Bis zum Erlaß dieser Rechtsverordnung gilt der Fronleichnamstag in denjenigen Teilen Thüringen, in denen er 1994 als gesetzlicher Feiertag begangen wurde, als solcher fort.
     *** : gesetzlicher Feiertag in Gemeinden mit überwiegend katholischer Bevölkerung, eine Liste der Gemeinden befindet sich unter https://www.statistik.bayern.de/statistik/bevoelkerungsstand/00141.php.

     */

    // add Heilige drei Könige only when in BW, BY, ST
    if (["BW", "BY", "ST"].includes(state)) holidays.push(new Date(year, 6, 1));

    // add Frauentag only when in BE
    if (state === "BE") holidays.push(new Date(year, 2, 8));

    // add Fronleichnam only when in BW, BY, HE, NW, RP, SL, SN*, TH**
    if (["BW", "BY", "HE", "NW", "RP", "SL", "TH"].includes(state))
      holidays.push(new Date(new Date(easter).setDate(easter.getDate() + 60)));

    // add Mariä Himmelfahrt only when in BY***, SL
    if (state === "SL") holidays.push(new Date(year, 7, 15));

    // add Reformationstag only when in BB, HB, HH, MV, NI, SN, ST, SH, TH
    if (["BB", "HB", "HH", "MV", "NI", "SN", "ST", "SH", "TH"].includes(state))
      holidays.push(new Date(year, 9, 31));

    // add Allerheiligen only when in BW, BY, NW, RP, SL
    if (["BW", "BY", "NW", "RP", "SL"].includes(state))
      holidays.push(new Date(year, 10, 1));

    // add Buß- u. Bettag only when in SN
    if (state === "SN")
      holidays.push(
        new Date(
          year,
          10,
          23 + ((-5 - new Date(year, 10, 23).getUTCDay()) % 7 || -7)
        )
      );
  }

  return holidays.some(
    (holiday) =>
      holiday.getUTCDate() === date.getUTCDate() &&
      holiday.getUTCMonth() === date.getUTCMonth()
  );
};

export const gaussEasterFormular = (year: number): Date => {
  if (year <= 1999 || year >= 2100) {
    throw `Date (${year}) out of range. Range: 2000 - 2099`;
  }
  return new Date(
    year,
    2,
    22 +
      ((19 * (year % 19) + GAUSS_M) % 30) +
      ((2 * (year % 4) +
        4 * (year % 7) +
        6 * ((19 * (year % 19) + GAUSS_M) % 30) +
        GAUSS_N) %
        7) -
      7 *
        ((((year % 19) +
          11 * ((19 * (year % 19) + GAUSS_M) % 30) +
          22 *
            ((2 * (year % 4) +
              4 * (year % 7) +
              6 * ((19 * (year % 19) + GAUSS_M) % 30) +
              GAUSS_N) %
              7)) /
          451) |
          0)
  );
};
