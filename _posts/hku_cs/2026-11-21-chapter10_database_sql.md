---
layout: post
title: "Chapter 10｜数据库与 SQL：关系模型与 DISTINCT"
tags: [HKU MSc CS, 计算机基础]
permalink: /hku_cs/chapter10_database_sql.html
---
> **目标**：答对关系型数据库概念和 SQL 去重题；能读懂最基础的查询语句。  
> **优先级：B/C**｜建议 20–30 分钟。上传笔经中明确出现“SQL 如何移除重复行”和关系数据库概念。

> **V2 版本说明**：以你上传的真题/笔经为核心，补充对应题型、完整解法与适当进阶。标注 **【真题补全】** 为资料直接涉及的考点；标注 **【拓展】** 为额外提高题；个别原资料答案如有问题会说明。

## 1. 关系型数据库的词汇

| 术语 | 意思 | 对应直觉 |
|---|---|---|
| Relation | 关系 | 一张符合关系模型的表 |
| Tuple | 元组 | 一条记录/一行 |
| Attribute | 属性 | 一个字段/一列 |
| Schema | 模式 | 表结构、字段及约束 |
| Primary Key | 主键 | 唯一标识记录，不能为 `NULL` |
| Foreign Key | 外键 | 引用另一表（或本表）的键 |
| `NULL` | 未知/缺失值 | 不等于普通数值 0 或空字符串 |

**重点**：理论关系是集合，不含完全相同的重复元组；但**SQL 查询结果在默认情况下往往采用多重集合（bag / multiset）语义**，允许出现重复行。这正是 `DISTINCT` 有用的原因。

## 2. 最常考：`DISTINCT` 去重（A）

```sql
SELECT DISTINCT city
FROM Students;
```

只保留每个不同 `city` 一行。若是多列：

```sql
SELECT DISTINCT city, major
FROM Students;
```

去重依据是**`(city, major)` 的组合**，并不是分别给 `city`、`major` 去重。

**简单例子**：

| name | city |
|---|---|
| Ann | HK |
| Ben | HK |
| Cara | SZ |

`SELECT city FROM Students;` → `HK, HK, SZ`；  
`SELECT DISTINCT city FROM Students;` → `HK, SZ`。

**容易误解的地方**：
- `DISTINCT` 是对**查询结果去重**，不等于永久删除表中重复数据。
- 没写 `ORDER BY` 时，不保证输出顺序。
- `NULL` 的比较使用 `IS NULL`，不是 `= NULL`。
- `DISTINCT` 处理多个 `NULL` 值时，查询结果通常保留一个 `NULL`；但 `COUNT(DISTINCT col)` **不计入 NULL**。

## 3. 必须读懂的 5 条 SQL（B）

**筛选**：
```sql
SELECT name, score FROM Students WHERE score >= 80;
```

**排序**：
```sql
SELECT name, score FROM Students ORDER BY score DESC;
```

**统计**：
```sql
SELECT COUNT(*) FROM Students;
```

**去重统计**：
```sql
SELECT COUNT(DISTINCT city) FROM Students;
```

**按组统计**：
```sql
SELECT city, COUNT(*) AS cnt
FROM Students
GROUP BY city;
```

区别：
- `WHERE` 筛选原始记录；
- `GROUP BY` 形成分组；
- `HAVING` 按分组后的聚合条件筛选；
- `COUNT(*)` 数行；`COUNT(col)` 不数该列为 `NULL` 的行。

## 4. 关系数据库概念题如何答（B）

- **主键**：必须唯一、非空，可以由一个或多个字段组成。
- **外键**：用于建立表与表之间的引用关系，不要求外键列本身唯一。
- **查询去重**：`SELECT DISTINCT`。
- **永久删记录**：`DELETE FROM ... WHERE ...`；不应把 `DISTINCT` 和 `DELETE` 混为一谈。
- **数据库与数据表**：数据库容纳多个相关数据对象；关系是表结构与数据组成的模型概念。
- **关系运算**：选择（筛选行）、投影（选择列）、连接（Join）只需认识用途；目前不优先学习复杂查询优化。

## 5. 面试表述与自测

英文一句话：*“SELECT DISTINCT removes duplicate rows from the query result, considering all selected columns together.”*

**自测**：
1. `SELECT DISTINCT a,b` 对什么去重？**组合 `(a,b)`**。  
2. `SELECT DISTINCT` 会删除表里重复的物理记录吗？**不会**。  
3. SQL 中如何判断 `name` 是空值？**`name IS NULL`**。  
4. 未指定 `ORDER BY` 时结果有固定顺序吗？**不保证**。  
5. `COUNT(*)` 与 `COUNT(name)` 什么时候可能不同？**存在 `name=NULL` 时**。

**掌握标准**：能准确解释关系/元组/属性，能写出 `DISTINCT`、`WHERE`、`GROUP BY` 的简单查询，能避开 NULL 和重复结果的陷阱。

---

## V2｜原始资料真题补全

### 1. 关系型数据库：表、键和约束（【原始笔经补全】）

假设有两张表：

```sql
CREATE TABLE Students (
    student_id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    city VARCHAR(50)
);
CREATE TABLE Enrollments (
    student_id INT,
    course_id INT,
    grade INT,
    FOREIGN KEY (student_id) REFERENCES Students(student_id)
);
```

- **关系 Relation**：概念上是一组满足模式的元组（SQL 表及查询结果通常带有多重集合语义）。
- **元组 Tuple**：一行记录；**属性 Attribute**：一列字段。
- **Primary Key**：主键唯一且不能为 NULL；可以是复合键。
- **Foreign Key**：保证被引用键值存在（具体可空性、级联规则由建表约束决定）；外键列不要求唯一。
- **`NULL`** 表示未知/缺失，不等于数值 0 或空字符串 `''`。`WHERE col=NULL` 不会按预期匹配，应使用 `IS NULL`。

**资料最直接笔试题：SQL 去重**
```sql
SELECT DISTINCT city FROM Students;
SELECT DISTINCT city, name FROM Students;
```
第一句按城市去重；第二句按 `(city,name)` **整行组合**去重。`DISTINCT` 只影响查询结果，不会永久删除原表记录。

### 2. WHERE、GROUP BY、HAVING、JOIN（【选择题迁移】）

```sql
-- 筛选高分
SELECT student_id, grade
FROM Enrollments
WHERE grade >= 80;

-- 按课程统计平均成绩
SELECT course_id, AVG(grade) AS avg_grade
FROM Enrollments
GROUP BY course_id;

-- 只返回平均分 > 80 的课程
SELECT course_id, AVG(grade) AS avg_grade
FROM Enrollments
GROUP BY course_id
HAVING AVG(grade) > 80;

-- 找出姓名与所选课程
SELECT s.name, e.course_id
FROM Students AS s
JOIN Enrollments AS e
  ON s.student_id = e.student_id;
```

**记忆区别**：
- `WHERE`：行进入分组之前的过滤；
- `GROUP BY`：把记录按一组键分组；
- `HAVING`：对分组聚合后的结果过滤；
- `ORDER BY`：对最终结果明确排序，否则输出顺序不作保证；
- `INNER JOIN`：只保留两边匹配的行；`LEFT JOIN`：左表所有行都保留，右表找不到的地方补 NULL。

**COUNT 陷阱**：`COUNT(*)` 数行；`COUNT(city)` 数非 NULL 的城市值；`COUNT(DISTINCT city)` 数不同且非 NULL 的城市值。

### 3. Database Transaction 与 ACID（【原始群面真实技术追问】）

**Transaction 事务**：把多个数据库操作当作一个逻辑工作单元。例：A 向 B 转账 100 元，必须同时完成“从 A 扣 100”和“向 B 加 100”；只做前半步会造成不一致。

**ACID 四个性质**：
- **Atomicity 原子性**：事务内的操作**全做或全不做**；中途失败则回滚。
- **Consistency 一致性**：事务执行前后都满足数据库规定的完整性约束（如余额不得出现违反规则的状态）。
- **Isolation 隔离性**：并发事务的中间状态互相隔离，隔离强度依级别不同。
- **Durability 持久性**：已提交的事务结果在故障恢复后仍应保留。

```sql
BEGIN;
UPDATE Accounts SET balance = balance - 100 WHERE id = 1;
UPDATE Accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
-- 任何中途错误应 ROLLBACK，而不是留下只扣款的状态
```

**面试英文 20 秒回答**：*“Atomicity means a transaction either commits all its operations or rolls them all back. This prevents a transfer from debiting one account without crediting the other.”*

**并发三种异常**：
- Dirty read 脏读：读到别人尚未提交的更改；
- Non-repeatable read 不可重复读：同一事务两次读取同一行却看到不同已提交版本；
- Phantom read 幻读：同一条件两次查询出现了新增/消失的匹配行。
- 真实隔离表现取决于数据库实现的隔离级别和 MVCC/锁策略，不宜把每种现象机械映射到一种产品。

### 4. 数据库范式与数据冗余（【原始面试提问】）

- **1NF 第一范式**：字段值应保持原子性（相对于所设计的关系模型，每个字段不存无结构的多值列表）。
- **2NF 第二范式**：满足 1NF，非主属性应完全依赖**整个候选键**，而不是复合候选键的一部分。
- **3NF 第三范式**：满足 2NF，避免非主属性对候选键产生不恰当的传递依赖；常见实战理解是把“学生—专业—院系”的重复信息拆到单独表维护。

例：若 `Student(student_id,major,department_phone)`，电话由专业决定，可能导致许多学生行重复同一个院系电话；把 `Major(major,department_phone)` 独立建表，学生表只引用专业，能减少更新异常。

**范式不是“拆得越细越好”**：规范化减轻冗余和更新异常，实际查询可能需要 JOIN；分析型系统有时会有意识做反规范化提升查询性能。

### 5. SQL 的五个小测

1. `SELECT DISTINCT a,b` 是分别对 a 和 b 去重吗？**否，对 (a,b) 组合去重**。
2. 统计未填城市的行数，`COUNT(city)` 能数到它们吗？**不能**。
3. “扣款成功、加款失败”侵犯 ACID 的哪条？**Atomicity（原子性）**。
4. `WHERE AVG(score)>80` 正确吗？**聚合筛选通常要用 HAVING**。
5. `LEFT JOIN` 右表没有匹配时，左表该行是否保留？**保留**。
6. 主键可以取 NULL 吗？**不可以**。

---

## V2｜进阶与迁移训练【拓展】

### E1. 索引 Index：为什么能加速查询【拓展】

关系数据库通常用 B-tree/B+tree 等索引结构支持范围查找、排序与等值查询。对适合的索引查询可近似理解为 `O(log n)` 的树搜索，但真实数据库性能还受数据页、选择率、缓存和执行计划影响。索引会占用额外空间，也会增加插入/更新维护成本。

### E2. 隔离级别与 MVCC【拓展】

常见隔离级别从较弱到较强：Read Uncommitted、Read Committed、Repeatable Read、Serializable。MVCC 用多个记录版本帮助读写并发。不同数据库产品的 Repeatable Read 语义和避免幻读的机制可能不同，复习重点是**为什么并发需要隔离**，而不是死背某产品的锁细节。

### E3. JOIN 和重复记录的关系【拓展】

如果学生 A 选了 3 门课，那么 `Students JOIN Enrollments` 结果会出现 3 条含 A 姓名的记录，这不是错误，而是 1 对多关系展开。若只想统计人数，要考虑 `COUNT(DISTINCT student_id)`，避免 JOIN 后的行数误当作人数。

### E4. SQL 注入与参数化查询【拓展】

不要把用户输入直接拼接成 SQL：
`"SELECT * FROM users WHERE name='"+user_input+"'"`。应使用参数化查询/预编译语句，由数据库驱动区分“查询结构”和“数据值”。这是开发中的高频安全概念，适合技术群面。

### E5. 如何设计一道简单数据库题【拓展】

设计课程报名系统时，核心实体 `Student`、`Course`、`Enrollment(student_id,course_id,registered_at)`。对于“一人不可重复报同一门课”，在报名关系上设置复合唯一约束 `(student_id,course_id)`，比仅靠前端判断更可靠。

### E6. 事务并发：丢失更新的最小案例【拓展】

A 和 B 两个事务都读余额 100，A 计算 `+10` 写 110，B 根据旧值计算 `−20` 写 80，最终余额变成 80，**丢失了 A 的更新**；串行执行的合理期望是 90。可通过合适的事务隔离、原子更新语句或乐观并发控制避免该类问题。

### E7. 聚合查询一眼做对【拓展】

```sql
SELECT city, COUNT(*) AS students
FROM Students
WHERE city IS NOT NULL
GROUP BY city
HAVING COUNT(*) >= 2
ORDER BY students DESC;
```
实际逻辑：先过滤 NULL 城市，再按 city 分组，再只取人数至少 2 的城市，最后按人数降序排列。SQL 引擎物理执行可能优化重排，但**理解 SQL 语义**时按照这个顺序非常有效。

### E8. 规范化为什么能减少异常【拓展】

若一张报名表把课程名称重复写在每个学生行，课程改名需要更新很多行，漏掉一行就出现不一致。把课程实体独立建 `Courses(course_id,course_name)`，报名记录只存 `course_id`，就能集中维护课程名称。规范化主要解决**更新异常、插入异常和删除异常**，不等于查询永远更快。

### E9. 快速解释索引与主键【拓展】

主键保证逻辑唯一性；索引加速某些查询，但索引列**不必唯一**。一张表通常只能有一个主键约束（主键可由多列组成），却可以有多个索引。频繁更新的列若无查询需求，盲目增加索引会增加维护成本。
