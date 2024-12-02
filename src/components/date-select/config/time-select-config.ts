// const options = []
// for (let index = 1; index <= 31; index++) {
//   const value = index + ''
//   const label = index + '日'
//   const time = { value, label }
//   options.push(time)
// }
// console.log(options)
interface TimeOptions {
  year: { value: string; label: string }[]
  month: { value: string; label: string }[]
  day: { value: string; label: string }[]
}

const year = [
  { value: '2010', label: '2010年' },
  { value: '2009', label: '2009年' },
  { value: '2008', label: '2008年' },
  { value: '2007', label: '2007年' },
  { value: '2006', label: '2006年' },
  { value: '2005', label: '2005年' },
  { value: '2004', label: '2004年' },
  { value: '2003', label: '2003年' },
  { value: '2002', label: '2002年' },
  { value: '2001', label: '2001年' },
  { value: '2000', label: '2000年' },
  { value: '1999', label: '1999年' },
  { value: '1998', label: '1998年' },
  { value: '1997', label: '1997年' },
  { value: '1996', label: '1996年' },
  { value: '1995', label: '1995年' },
  { value: '1994', label: '1994年' },
  { value: '1993', label: '1993年' },
  { value: '1992', label: '1992年' },
  { value: '1991', label: '1991年' },
  { value: '1990', label: '1990年' },
  { value: '1989', label: '1989年' },
  { value: '1988', label: '1988年' },
  { value: '1987', label: '1987年' },
  { value: '1986', label: '1986年' },
  { value: '1985', label: '1985年' },
  { value: '1984', label: '1984年' },
  { value: '1983', label: '1983年' },
  { value: '1982', label: '1982年' },
  { value: '1981', label: '1981年' },
  { value: '1980', label: '1980年' },
  { value: '1979', label: '1979年' },
  { value: '1978', label: '1978年' },
  { value: '1977', label: '1977年' },
  { value: '1976', label: '1976年' },
  { value: '1975', label: '1975年' },
  { value: '1974', label: '1974年' },
  { value: '1973', label: '1973年' },
  { value: '1972', label: '1972年' },
  { value: '1971', label: '1971年' },
  { value: '1970', label: '1970年' },
  { value: '1969', label: '1969年' },
  { value: '1968', label: '1968年' },
  { value: '1967', label: '1967年' },
  { value: '1966', label: '1966年' },
  { value: '1965', label: '1965年' },
  { value: '1964', label: '1964年' },
  { value: '1963', label: '1963年' },
  { value: '1962', label: '1962年' },
  { value: '1961', label: '1961年' },
  { value: '1960', label: '1960年' },
  { value: '1959', label: '1959年' },
  { value: '1958', label: '1958年' },
  { value: '1957', label: '1957年' },
  { value: '1956', label: '1956年' },
  { value: '1955', label: '1955年' },
  { value: '1954', label: '1954年' },
  { value: '1953', label: '1953年' },
  { value: '1952', label: '1952年' },
  { value: '1951', label: '1951年' },
  { value: '1950', label: '1950年' },
  { value: '1949', label: '1949年' },
  { value: '1948', label: '1948年' },
  { value: '1947', label: '1947年' },
  { value: '1946', label: '1946年' },
  { value: '1945', label: '1945年' },
  { value: '1944', label: '1944年' },
  { value: '1943', label: '1943年' },
  { value: '1942', label: '1942年' },
  { value: '1941', label: '1941年' }
]
const day = [
  { value: '01', label: '1日' },
  { value: '02', label: '2日' },
  { value: '03', label: '3日' },
  { value: '04', label: '4日' },
  { value: '05', label: '5日' },
  { value: '06', label: '6日' },
  { value: '07', label: '7日' },
  { value: '08', label: '8日' },
  { value: '09', label: '9日' },
  { value: '10', label: '10日' },
  { value: '11', label: '11日' },
  { value: '12', label: '12日' },
  { value: '13', label: '13日' },
  { value: '14', label: '14日' },
  { value: '15', label: '15日' },
  { value: '16', label: '16日' },
  { value: '17', label: '17日' },
  { value: '18', label: '18日' },
  { value: '19', label: '19日' },
  { value: '20', label: '20日' },
  { value: '21', label: '21日' },
  { value: '22', label: '22日' },
  { value: '23', label: '23日' },
  { value: '24', label: '24日' },
  { value: '25', label: '25日' },
  { value: '26', label: '26日' },
  { value: '27', label: '27日' },
  { value: '28', label: '28日' },
  { value: '29', label: '29日' },
  { value: '30', label: '30日' },
  { value: '31', label: '31日' }
]

const month = [
  { value: '01', label: '1月' },
  { value: '02', label: '2月' },
  { value: '03', label: '3月' },
  { value: '04', label: '4月' },
  { value: '05', label: '5月' },
  { value: '06', label: '6月' },
  { value: '07', label: '7月' },
  { value: '08', label: '8月' },
  { value: '09', label: '9月' },
  { value: '10', label: '10月' },
  { value: '11', label: '11月' },
  { value: '12', label: '12月' }
]

const ymhOptions: TimeOptions = { year: year, month: month, day: day }

export { ymhOptions, type TimeOptions }
