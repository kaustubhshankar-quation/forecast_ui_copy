// const DataFrequency =[
//     { value: 'Transaction', label: 'Transaction' , disabledValues:[] },
//     { value: 'Daily', label: 'Daily' , disabledValues:[] },
//     { value: 'Weekly', label: 'Weekly' , disabledValues:[] },
//     { value: 'Monthly', label: 'Monthly' , disabledValues:['Weekly'] },
//     { value: 'Quarterly', label: 'Quarterly' , disabledValues:['Weekly','Monthly'] }
//   ]
const DataFrequency = [
  { value: 'Transaction', label: 'Transaction', disabledValues: [], isDisabled: true },
  { value: 'Daily', label: 'Daily', disabledValues: [], isDisabled: true },
  { value: 'Weekly', label: 'Weekly', disabledValues: [], isDisabled: false },
  // { value: 'Monthly', label: 'Monthly', disabledValues: ['Weekly','Quarterly'], isDisabled: false }, // Only enabled one
  { value: 'Monthly', label: 'Monthly', disabledValues: ['Weekly', 'Quarterly'], isDisabled: false }, // Only enabled one
  { value: 'Quarterly', label: 'Quarterly', disabledValues: ['Weekly', 'Monthly'], isDisabled: true }
];

const ForecastPeriods = [
  {
    frequency: 'Daily',
    periods: ['15 Days', '30 Days']
  },
  {
    frequency: 'Weekly',
    periods: [
      "Next 1 week",
      "Next 2 weeks",
      "Next 3 weeks",
      "Next 4 weeks",
      "Next 5 weeks",
      "Next 6 weeks",
      "Next 7 weeks",
      "Next 8 weeks",
      "Next 9 weeks",
      "Next 10 weeks",
      "Next 11 weeks",
      "Next 12 weeks",
      "Next 13 weeks",
      "Next 14 weeks",
      "Next 15 weeks",
      "Next 16 weeks",
      "Next 17 weeks",
      "Next 18 weeks",
      "Next 19 weeks",
      "Next 20 weeks",
      "Next 21 weeks",
      "Next 22 weeks",
      "Next 23 weeks",
      "Next 24 weeks",
      "Next 25 weeks",
      "Next 26 weeks",
      "Next 27 weeks",
      "Next 28 weeks",
      "Next 29 weeks",
      "Next 30 weeks",
      "Next 31 weeks",
      "Next 32 weeks",
      "Next 33 weeks",
      "Next 34 weeks",
      "Next 35 weeks",
      "Next 36 weeks",
      "Next 37 weeks",
      "Next 38 weeks",
      "Next 39 weeks",
      "Next 40 weeks",
      "Next 41 weeks",
      "Next 42 weeks",
      "Next 43 weeks",
      "Next 44 weeks",
      "Next 45 weeks",
      "Next 46 weeks",
      "Next 47 weeks",
      "Next 48 weeks",
      "Next 49 weeks",
      "Next 50 weeks",
      "Next 51 weeks",
      "Next 52 weeks"
    ]
  },
  {
    frequency: 'Monthly',
    periods: [
      "Next 1 month",
      "Next 2 months",
      "Next 3 months",
      "Next 4 months",
      "Next 5 months",
      "Next 6 months",
      "Next 7 months",
      "Next 8 months",
      "Next 9 months",
      "Next 10 months",
      "Next 11 months",
      "Next 12 months"
    ]
  },
  {
    frequency: 'Quarterly',
    periods: [
      "Next 3 Quarters",
      "Next 6 Quarters",
      "Next 9 Quarters",
      "Next 12 Quarters"
    ]
  },
]


const GranularityList = [
  { id: 'Weekly', label: 'Weekly' },
  { id: 'Monthly', label: 'Monthly' },
  { id: 'Quarterly', label: 'Quarterly' }
]

export { DataFrequency, ForecastPeriods, GranularityList }