using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;


namespace SqlWhereToJS
{
    public static class BLLWhereSqlToJS
    {
        public const string PATTERNLIKE = "(?<=[^a-z_0-9])([a-z_0-9]+)\\s+like\\s+'(%?[\\wÀ-ú0-9]+%?)'";
        public const string PATTERNIN = "([a-z_0-9]+)\\s+(in|not in)\\s*\\(([\\wÀ-ú0-9,'\\s]+)\\)";
        public const string PATTERNDATEADD = "(([a-z_]+) *([>=<!]{1,3}) *(dateAdd *\\(([a-z]+) *, *-*([0-9]+),.+\\)))";

        public static string Convert(string strSql)
        {

            string retJS;

            try
            {
                
                retJS = ReplaceSqlToJS(strSql);

            }
            catch (FormatException ex)
            {
                throw ex;
            }

            return retJS;

        }
        private static string ReplaceSqlToJS(string strSQL)
        {

            string stringMutate = strSQL;

            List<PatternReplace> listReplace = new List<PatternReplace>
            {
                new PatternReplace() { Description = "Iqual", Search = "[=]", Replace = "==" },
                new PatternReplace() { Description = "AliasTable", Search = "(A\\.|B\\.)", Replace = string.Empty },
                new PatternReplace() { Description = "And", Search = "(and)", Replace = "&&" },
                new PatternReplace() { Description = "Or", Search = "(or)", Replace = "||" },
                new PatternReplace() { Description = "IsNull", Search = "(is null)", Replace = "=== null" },
                new PatternReplace() { Description = "Bracket", Search = "[\\[\\]]", Replace = String.Empty },

            };

            //Efetuando alguns replaces padrões
            foreach (PatternReplace pattern in listReplace)
            {
                strSQL = Regex.Replace(strSQL, pattern.Search, pattern.Replace, RegexOptions.IgnoreCase);
            }

            try
            {
                //tratando instruções LIKE
                strSQL = Regex.Replace(strSQL, PATTERNLIKE, ReplaceLikeSqlToJs, RegexOptions.IgnoreCase);
                //tratando instruções IN
                strSQL = Regex.Replace(strSQL, PATTERNIN, ReplaceInSqlToJs, RegexOptions.IgnoreCase);
                //tratando instruções DateAdd
                strSQL = convertDateAdd(strSQL);

                
            }
            catch (FormatException ex)
            {
                throw new FormatException(ex.Message);
            }

            return strSQL;

        }

        private static string convertDateAdd(string strSql)
        {

            string strJS = String.Empty;

            if(!strSql.ToLower().Contains("dateadd")) {
                return strSql;
            }
            
            string[] ret;
            string retString = String.Empty;
            //O regex só identifica uma dateAdd por vez, então criamos um array para tratar todos AND e OR
            //ret = strSql.Split(new string [] { "||", "&&" }, StringSplitOptions.RemoveEmptyEntries);
            string pattern = "([&/|]{2})";
           ret = Regex.Split(strSql, pattern);


            foreach (string str in ret)
            {
                strJS += Regex.Replace(str, PATTERNDATEADD, ReplaceDateAddSqlToJs, RegexOptions.IgnoreCase);
                //strSql = strSql.Replace(str, retString);
            }
            
            return strJS;

        }


        private static string ReplaceDateAddSqlToJs(Match match)
        {
            string strJs;
            if (match.Groups.Count > 1)
            {
                string strField = match.Groups[2].Value;
                string strOperator = match.Groups[3].Value;
                string strReplace = match.Groups[4].Value;
                string srtDateType = match.Groups[5].Value;
                string strValue = match.Groups[6].Value;

                bool endDate = match.Value.ToLower().Contains("dbo.end") ? true : false;


                strJs = $"DateJS.convertDate({strField}) {strOperator} DateJS.DateAdd('{srtDateType}', {strValue}, '{strOperator}', {endDate.ToString().ToLower()})";

               
            } else
            {
                throw new System.FormatException($"Error Query SQL [DateAdd] Badly Formatted, partial query: {match.Value}  ");
            }


            return strJs;
        }

        private static string ReplaceInSqlToJs(Match match)
        {
            string strInJs;

            if (match.Groups.Count > 1)
            {

                string strField = match.Groups[1].Value;
                string strOperator = match.Groups[2].Value.Replace("'", string.Empty);
                string strIN = match.Groups[3].Value.Replace("'", string.Empty);

                strInJs = "";

                var arrayIN = strIN.Split(',').Select(x => x.Trim()).Where(x => !string.IsNullOrWhiteSpace(x)).ToArray();
                if (arrayIN.Length < 1)
                {
                    throw new System.FormatException($"Error Query SQL [IN] Badly Formatted, partial query: {match.Value}  ");
                }

                string strRegexIn = $"/(({string.Join("|", arrayIN)})/i)";


                if (strOperator.ToLower() == "not in")
                {
                    strInJs = $"{strField}.match({strRegexIn}) == null";
                }
                else
                {
                    strInJs = $"{strField}.match({strRegexIn}) != null";
                }
            }
            else
            {
                strInJs = match.Value;
            }


            return strInJs;
        }

        private static string ReplaceLikeSqlToJs(Match match)
        {

            string strContainsJs;

            if (match.Groups.Count > 1)
            {
                string strField = match.Groups[1].Value;
                string strLike = match.Groups[2].Value;
                string strClause = strLike.Replace("%", string.Empty).ToLower();

                if (strLike.StartsWith("%") && strLike.EndsWith("%"))
                {
                    strContainsJs = $"({strField}.toLowerCase().indexOf('{strClause}') > -1)";
                }
                else if (strLike.StartsWith("%"))
                {
                    strContainsJs = $"({strField}.toLowerCase().startsWith('{strClause}') === true)";
                }
                else if (strLike.EndsWith("%"))
                {
                    strContainsJs = $"({strField}.toLowerCase().endsWith('{strClause}') === true)";
                }
                else
                {
                    throw new System.FormatException($"Error Query SQL [LIKE] Badly Formatted, partial query: {match.Value}  ");
                }

            }
            else
            {
                strContainsJs = match.Value;
            }
            return strContainsJs;
        }

        private class PatternReplace
        {
            public string Description { get; set; }
            public string Search { get; set; }
            public string Replace { get; set; }

        }

    }
}
