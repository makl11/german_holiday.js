import { gaussEasterFormular, isHoliday } from ".";

describe("isHoliday", () => {
  test("should return false for a day that is not a holiday", () => {
    const result = isHoliday(new Date(2022, 0, 11));
    expect(result).toEqual(false);
  });

  test.each([
    ["Tag der dt. Einheit", [3, 10, 2099]],
    ["Karfreitag", [16, 4, 2060]],
    ["Erster Weihnachtstag", [25, 12, 2012]],
    ["Erster Mai", [1, 5, 2007]],
    ["Christi Himmelfahrt", [26, 5, 2022]],
  ])("should return true for %s %p", (_, [day, month, year]) => {
    const result = isHoliday(new Date(year, month - 1, day));
    expect(result).toEqual(true);
  });

  test("should returns false for a day that is not a holiday in the provided state", () => {
    const result = isHoliday(new Date(2022, 10, 16), "NW"); // only true for state = "SN"
    expect(result).toEqual(false);
  });

  test.each([
    [16, 2022],
    [20, 2019],
  ])("should return true for Buß und Bettag [%d,11,%d]", (day, year) => {
    const result = isHoliday(new Date(year, 10, day), "SN");
    expect(result).toEqual(true);
  });
});

describe("gaussEasterFormular", () => {
  test.each([
    [new Date(2020, 3, 12).toLocaleDateString("de"), 2020],
    [new Date(2021, 3, 4).toLocaleDateString("de"), 2021],
    [new Date(2022, 3, 17).toLocaleDateString("de"), 2022],
  ])("should return the %s as the date of easter for %d", (expected, year) => {
    const easterDate = gaussEasterFormular(year);
    expect(expected).toEqual(easterDate.toLocaleDateString("de"));
  });

  test("should throw an error when the date is out of range", () => {
    expect(() => gaussEasterFormular(1999)).toThrowError();
    expect(() => gaussEasterFormular(2100)).toThrowError();
  });
});
