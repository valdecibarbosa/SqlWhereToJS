# SqlWhereToJS
Classe C# .Net Framework para "Transpilar" cláusulas  Where SQL par instruções Javascript.

## Como Usar:

```
string strSQL = "(DDI == '55' && DDD IN('11','12','13'))";
string retorno = BLLWhereSqlToJS.Convert(strSQL);
```

## Classe DateJS (Javascript)

- Para converter o dateAdd do SQL para javascript criei  a classe DateJs contendo dois métodos.

### convertDate: Converter datas do formato SQL para o formato Javascript.

Exemplo:
```javascript
let DateJs = new DateJS();
const dateSqlJs = DateJs.convertDate("2020-04-22 15:00:30.000")
console.log("data do banco convertida", new Date(dateSqlJs));
```
### dateAdd: Cria datas relativas de acordo com os paramêtros;

Exemplo:
```javascript
let DateJs = new DateJS();
DateJs.dateAdd("mi", 10, false);
DateJs.dateAdd("HH", 2, false);
DateJs.dateAdd("dd", 2, true);
DateJs.dateAdd("ww", 2, false);
DateJs.dateAdd("mm", 2, true);
DateJs.dateAdd("yyyy", 3, true);
```
# Instruções Javascript
- A string retornada pelo método Convert do Objeto BLLWhereSqlToJS é uma instrução javascript que pode ser  usada para validações.
Exemplo:

```javascript
let result;
if (! (  DateJs.convertDate(InsertDate) >= DateJs.dateAdd('yyyy', 2, false)   &&       DateJs.convertDate(InsertDate) <= DateJs.dateAdd('yyyy', 2, true)   )) {
  result = true;
} else {
  result = false;
}

console.log("result: ", result);
```

## Todo:
Melhorar documentação e ampliar os exemplos demonstrando a Query SQL antes e a instrução Javascript depois.

