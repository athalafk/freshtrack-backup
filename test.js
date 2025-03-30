// When displaying dates, specify the timezone
const date = new Date(databaseDateString);
console.log(date.toLocaleDateString('en-GB', { timeZone: 'UTC' }));