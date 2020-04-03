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
      diff = aux.getDate() - day + 7; //+ (day == 0 ? -6 : 1); // adjust when day is sunday
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
      aux.getMonth(),
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

  dateAdd(dateType, intValue, logicOperator, endDate) {
    /**
     *  dateType: (mi, HH, dd, ww, mm, yyyy)
     *  intValue: (integer)
     *  logicOperator: (===, !==, >, >==, <, <== )
     *  endDate: boolean
     */

    //console.log(dateType, intValue, logicOperator, endDate);

    let convertedDate;
    let dateAdd;
    const now = new Date();
    const revertOperator =
      logicOperator == "<" || logicOperator == "<==" ? true : false;

    switch (dateType) {
      case "mi":
        dateAdd =
          revertOperator == true
            ? new Date(now.setMinutes(now.getMinutes() - intValue))
            : new Date(now.setMinutes(now.getMinutes() + intValue));
        convertedDate =
          endDate == true
            ? this.getEndMinute(dateAdd)
            : this.getBeginMinute(dateAdd);

        break;
      case "HH":
        dateAdd =
          revertOperator == true
            ? new Date(now.setHours(now.getHours() - intValue))
            : new Date(now.setHours(now.getHours() + intValue));

        convertedDate =
          endDate == true
            ? this.getEndHour(dateAdd)
            : this.getBeginHour(dateAdd);

        break;
      case "dd":
        dateAdd =
          revertOperator == true
            ? new Date(now.setDate(now.getDate() - intValue))
            : new Date(now.setDate(now.getDate() + intValue));
        convertedDate =
          endDate == true ? this.getEndDay(dateAdd) : this.getBeginDay(dateAdd);

        break;
      case "ww":
        dateAdd =
          revertOperator == true
            ? new Date(now.setDate(now.getDate() - intValue * 7))
            : new Date(now.setDate(now.getDate() + intValue * 7));

        convertedDate =
          endDate == true
            ? this.getEndWeek(dateAdd)
            : this.getBeginWeek(dateAdd);

        break;
      case "mm":
        dateAdd =
          revertOperator == true
            ? new Date(now.setMonth(now.getMonth() - intValue))
            : new Date(now.setMonth(now.getMonth() + intValue));
        convertedDate =
          endDate == true
            ? this.getEndMonth(dateAdd)
            : this.getBeginMonth(dateAdd);
        break;
      case "yyyy":
        dateAdd =
          revertOperator == true
            ? new Date(now.setFullYear(now.getFullYear() - intValue))
            : new Date(now.setFullYear(now.getFullYear() + intValue));

        convertedDate =
          endDate == true
            ? this.getEndYear(dateAdd)
            : this.getBeginYear(dateAdd);

        break;
      default:
        console.log("type date invalid");
    }

    /* console.log(
      "data Convertida",
      convertedDate.toLocaleString("pt-BR", { hour12: false })
    );*/

    return convertedDate.getTime();
  }
}
let minhaClass = new DateJS();

//minhaClass.dateAddJs("mi", 10);
//minhaClass.dateAddJs("hh", 2);
//minhaClass.dateAddJs("dd", 2);
//minhaClass.dateAddJs("ww", 2);
//minhaClass.dateAddJs("mm", 2);
//minhaClass.dateAddJs("yyyyy", 3);

//const auxteste = new Date();

//console.log(new Date(aux.getFullYear(), aux.getMonth(), 1));
//console.log(new Date(aux.getFullYear(), aux.getMonth() + 1, 0));

const dateSqlJs = minhaClass.convertDate("2020-04-03 18:00:00.000");
console.log("data do banco convertida", new Date(dateSqlJs));

let convertedDate = minhaClass.dateAdd("HH", 0, ">", false);
console.log("data Convertida UTC", new Date(convertedDate));

console.log(
  "data Convertida BR",
  new Date(convertedDate).toLocaleString("pt-BR", { hour12: false })
);

let result;
if (dateSqlJs == convertedDate) {
  result = true;
} else {
  result = false;
}

console.log("result: ", result);
