class DateJS {
  
  convertDate(sqlDate) {
    return new Date(sqlDate).getTime();
  }

  getBeginMinute(dateInput) {
    dateInput.setSeconds(0);
    dateInput.setMilliseconds(0);
    return dateInput;
  }

  getEndMinute(dateInput) {
    dateInput.setSeconds(59);
    dateInput.setMilliseconds(999);
    return dateInput;
  }

  getBeginHour(dateInput) {
    let aux = this.getBeginMinute(dateInput);
    aux.setMinutes(0);
    return aux;
  }

  getEndHour(dateInput) {
    let aux = this.getEndMinute(dateInput);
    aux.setMinutes(59);
    return aux;
  }

  getBeginDay(dateInput) {
    let aux = this.getBeginHour(dateInput);
    aux.setHours(0);
    return aux;
  }

  getEndDay(dateInput) {
    let aux = this.getEndHour(dateInput);
    aux.setHours(23);
    return aux;
  }

  getBeginWeek(dateInput) {
    //verficar se semana começa no domingo ou na segunda
    let aux = this.getBeginDay(dateInput);
    let day = aux.getDay(),
      diff = aux.getDate() - day; //+ (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(aux.setDate(diff));
  }

  getEndWeek(dateInput) {
    let aux = this.getEndDay(dateInput);
    let day = aux.getDay(),
      diff = aux.getDate() - day + 6; //+ (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(aux.setDate(diff));
  }

  getBeginMonth(dateInput) {
    let aux = this.getBeginDay(dateInput);
    return new Date(aux.getFullYear(), aux.getMonth(), 1);
  }

  getEndMonth(dateInput) {
    let aux = this.getEndDay(dateInput);

    return new Date(
      aux.getFullYear(),
      aux.getMonth() + 1,
      0,
      aux.getHours(),
      aux.getMinutes(),
      aux.getSeconds(),
      aux.getMilliseconds()
    );
  }

  getBeginYear(dateInput) {
    let aux = this.getBeginMonth(dateInput);
    return new Date(aux.getFullYear(), 0, 1);
  }
  
  getEndYear(dateInput) {
    let aux = this.getEndMonth(dateInput);
    return new Date(
      aux.getFullYear() + 1,
      0,
      0,
      aux.getHours(),
      aux.getMinutes(),
      aux.getSeconds(),
      aux.getMilliseconds()
    );
  }

  dateAdd(dateType, intValue, endDate) {
    /**
     *  dateType: (mi, HH, dd, ww, mm, yyyy)
     *  intValue: (integer)
     *  endDate: boolean
     */

    //console.log(dateType, intValue, logicOperator, endDate);

    let convertedDate;
    let dateAdd;
    const now = new Date();

    switch (dateType) {
      case "mi":
        dateAdd = new Date(now.setMinutes(now.getMinutes() + intValue));
        convertedDate =
          endDate == true
            ? this.getEndMinute(dateAdd)
            : this.getBeginMinute(dateAdd);

        break;
      case "HH":
        dateAdd = new Date(now.setHours(now.getHours() + intValue));

        convertedDate =
          endDate == true
            ? this.getEndHour(dateAdd)
            : this.getBeginHour(dateAdd);

        break;
      case "dd":
        dateAdd = new Date(now.setDate(now.getDate() + intValue));
        convertedDate =
          endDate == true ? this.getEndDay(dateAdd) : this.getBeginDay(dateAdd);
        break;
      case "ww":
        dateAdd = new Date(now.setDate(now.getDate() + intValue * 7));

        convertedDate =
          endDate == true
            ? this.getEndWeek(dateAdd)
            : this.getBeginWeek(dateAdd);

        break;
      case "mm":
        dateAdd = new Date(now.setMonth(now.getMonth() + intValue));
        convertedDate =
          endDate == true
            ? this.getEndMonth(dateAdd)
            : this.getBeginMonth(dateAdd);
        break;
      case "yyyy":
        dateAdd = new Date(now.setFullYear(now.getFullYear() + intValue));

        convertedDate =
          endDate == true
            ? this.getEndYear(dateAdd)
            : this.getBeginYear(dateAdd);

        break;
      default:
        console.log("type date invalid");
    }

    return convertedDate.getTime();
  }
};

let DateJs = new DateJS();