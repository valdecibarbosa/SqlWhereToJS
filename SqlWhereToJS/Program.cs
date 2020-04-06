using System;


namespace SqlWhereToJS
{
    class Program
    {
        static void Main(string[] args)
        {
            //string strSQL = "(( (((A.LastDispositionId < 100))) OR (((A.DateLastAttempt is null and A.CounterAttempt = 0)))) AND ( (( B.DDD = '11' )))) and (((A.name like '%Váldeci'))) and (B.Detalhe in ('25')) ";

            //string strSQL = "A.[VGX_DT_INICIO_VIGENCIA]  > dateadd (yyyy , 1 ,  DATEADD(yy, DateDiff(yy, 0, getdate()) - 0, 0))";
            //string strSQL = "A.[VGX_DT_INICIO_VIGENCIA] >=  dateadd (yyyy , 2 ,  DateAdd(yy, DateDiff(yy, 0, getdate()) - 0, 0)   )  OR   A.[VGX_DT_INICIO_VIGENCIA] < dateadd (yyyy , -3 ,  DateAdd(yy, DateDiff(yy, 0, getdate()) - 0, 0) AND A.[VGX_DT_INICIO_VIGENCIA] < dateadd (mm , -5 ,  DateAdd(yy, DateDiff(yy, 0, getdate()) - 0, 0))";
            //string strSQL = "(A.[VGX_DT_INICIO_VIGENCIA] >=  dateadd (yyyy , 5 ,  DBO.BeginYear()  )  and  A.[VGX_DT_INICIO_VIGENCIA] <=  dateadd (yyyy , 5 ,  DBO.EndYear()  ))";
            //string strSQL = "(A.[VGX_DT_INICIO_VIGENCIA] >= dateadd (yyyy, 5, DBO.BeginYear()) and A.[VGX_DT_INICIO_VIGENCIA] <= dateadd (yyyy, 5, DBO.EndYear())) ";
            string strSQL = "not (  A.[InsertDate] >=      dateadd(yyyy,2,DBO.BeginYear())   and       A.[InsertDate] <=  dateadd(yyyy,2,DBO.EndYear())   )";
            
            try
            {
                var teste = BLLWhereSqlToJS.Convert(strSQL);
                Console.WriteLine(strSQL);
                Console.WriteLine("=====");
                Console.WriteLine(teste);
            }
            catch (FormatException ex)
            {
                Console.WriteLine(ex);
            }

            Console.ReadKey();

        }
    }
}
