using System;


namespace SqlWhereToJS
{
    class Program
    {
        static void Main(string[] args)
        {
            string strSQL = "(( (((A.LastDispositionId < 100))) OR (((A.DateLastAttempt is null and A.CounterAttempt = 0)))) AND ( (( B.DDD = '11' )))) and (((A.name like '%Váldeci'))) and (B.Detalhe in ('25')) ";


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
