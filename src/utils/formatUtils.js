const formatDate = (date) => {
  let d
  // see if the date is coming from the server
  date === undefined ? (d = new Date()) : (d = new Date(Date.parse(date)))

  let _day = d.getDate()
  let _month = d.getMonth() + 1
  let _year = d.getFullYear()

  if (_month < 10) {
    _month = '0' + _month
  }
  if (_day < 10) {
    _day = '0' + _day
  }

  return _year + '-' + _month + '-' + _day
}

export { formatDate }
