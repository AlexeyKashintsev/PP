/**
 *
 * @author Алексей
 * @name cache_update
 * @manual
 */ 
Select * 
From cache t1
where :url = t1.url and :response = t1.response