DROP PROCEDURE IF EXISTS testDeleteHandle;
DELIMITER $$
 
 CREATE PROCEDURE testDeleteHandle()
BEGIN
  DECLARE jzs_tablename VARCHAR(100);
 
 /*显示表的数据库中的所有表
 SELECT table_name FROM information_schema.tables WHERE table_schema='jianzhishu' Order by table_name ;
 */
 
#显示所有
 DECLARE cur_table_structure CURSOR
 FOR 
 SELECT table_name 
 FROM INFORMATION_SCHEMA.TABLES 
 WHERE table_schema = 'jianzhishu' AND table_name NOT IN (
 SELECT t.table_name  FROM (
	 SELECT table_name,column_name FROM information_schema.columns 
	 WHERE table_name IN ( 
		SELECT table_name 
		FROM INFORMATION_SCHEMA.TABLES 
		WHERE table_schema = 'jianzhishu')
	 ) t WHERE t.column_name='deletetime' 
 );
 
 DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET jzs_tablename = NULL;
 
 OPEN cur_table_structure;
 
 FETCH cur_table_structure INTO jzs_tablename;
 
 WHILE ( jzs_tablename IS NOT NULL) DO

  set @MyQuery=CONCAT("alter table `",jzs_tablename,"` drop column `deletetime`");
  PREPARE msql FROM @MyQuery;
  
  EXECUTE msql;#USING @c; 
   
  FETCH cur_table_structure INTO jzs_tablename;
  
  END WHILE;
 CLOSE cur_table_structure;
 
 
END;
 $$
 
 #执行存储过程
 CALL testDeleteHandle();